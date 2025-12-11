
// Simulação de serviço de pagamento Asaas Baseado na Documentação Oficial
// API Reference: https://docs.asaas.com/

export const ADMIN_WALLET_ID = "5ca8bff7-873a-4de5-867f-ba92a26547a5";

// --- INTERFACES (Based on OpenAPI DTOs) ---

export interface AsaasCustomer {
    id: string;
    name: string;
    email: string;
    cpfCnpj: string;
    mobilePhone?: string;
    dateCreated: string;
}

export interface AsaasSplit {
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
}

export interface AsaasCreditCard {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
}

export interface AsaasCreditCardHolderInfo {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
}

export interface AsaasPaymentRequest {
    customer: string; // Asaas Customer ID (cus_...)
    billingType: 'CREDIT_CARD' | 'PIX';
    value: number;
    dueDate: string;
    description?: string;
    externalReference?: string;
    split?: AsaasSplit[];
    creditCard?: AsaasCreditCard;
    creditCardHolderInfo?: AsaasCreditCardHolderInfo;
    remoteIp?: string;
}

export interface AsaasPaymentResponse {
    id: string;
    dateCreated: string;
    customer: string;
    billingType: 'CREDIT_CARD' | 'PIX';
    value: number;
    netValue: number;
    status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE';
    description?: string;
    invoiceUrl?: string;
    split?: {
        walletId: string;
        fixedValue?: number;
        percentualValue?: number;
        totalValue: number;
    }[];
    // Fields for Pix simulation
    pixQrCodePayload?: string; 
    pixQrCodeImage?: string;
}

export interface PixCharge {
    encodedImage: string;
    payload: string;
    expirationDate: string;
}

export interface PaymentResult {
    transactionId: string;
    date: Date;
    totalAmount: number;
    splits: {
        admin: {
            amount: number;
            walletId: string;
        }
    };
}

// --- MOCK DATABASE ---

let customersDB: AsaasCustomer[] = [];
let paymentsDB: AsaasPaymentResponse[] = [];
let adminBalance = 0.0;

// --- ASAAS API SIMULATION (Endpoints) ---

export const AsaasApi = {
    customers: {
        // GET /v3/customers
        list: async (filters: { cpfCnpj?: string, email?: string }): Promise<AsaasCustomer[]> => {
            return customersDB.filter(c => 
                (filters.cpfCnpj && c.cpfCnpj === filters.cpfCnpj) || 
                (filters.email && c.email === filters.email)
            );
        },

        // POST /v3/customers
        create: async (data: Omit<AsaasCustomer, 'id' | 'dateCreated'>): Promise<AsaasCustomer> => {
            const newCustomer: AsaasCustomer = {
                id: `cus_${Math.random().toString(36).substr(2, 12)}`,
                dateCreated: new Date().toISOString().split('T')[0],
                ...data
            };
            customersDB.push(newCustomer);
            console.log(`[Asaas API] Cliente criado: ${newCustomer.id} - ${newCustomer.name}`);
            return newCustomer;
        }
    },

    payments: {
        // POST /v3/payments
        create: async (data: AsaasPaymentRequest): Promise<AsaasPaymentResponse> => {
            const isPix = data.billingType === 'PIX';
            
            // Calculate Split Logic for Simulation
            let splitResponse = undefined;
            if (data.split && data.split.length > 0) {
                splitResponse = data.split.map(s => {
                    let val = 0;
                    if (s.fixedValue) val = s.fixedValue;
                    else if (s.percentualValue) val = (data.value * s.percentualValue) / 100;
                    
                    // Update mock admin balance if this split belongs to admin
                    if (s.walletId === ADMIN_WALLET_ID) {
                        adminBalance += val;
                    }
                    return {
                        walletId: s.walletId,
                        fixedValue: s.fixedValue,
                        percentualValue: s.percentualValue,
                        totalValue: val
                    };
                });
            }

            // Simulate Pix Payload Generation
            let pixPayload = undefined;
            let pixImage = undefined;
            if (isPix) {
                pixPayload = `00020126580014br.gov.bcb.pix0136${ADMIN_WALLET_ID}520400005303986540${data.value.toFixed(2).replace('.', '')}5802BR5913GolyTransport6009SaoPaulo62070503***6304`;
                pixImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${pixPayload}`;
            }

            const newPayment: AsaasPaymentResponse = {
                id: `pay_${Math.random().toString(36).substr(2, 12)}`,
                dateCreated: new Date().toISOString().split('T')[0],
                customer: data.customer,
                billingType: data.billingType,
                value: data.value,
                netValue: data.value * 0.95, // Simulating Asaas fees
                status: isPix ? 'PENDING' : 'CONFIRMED', // Credit card auto-approved in sandbox
                description: data.description,
                split: splitResponse,
                pixQrCodePayload: pixPayload,
                pixQrCodeImage: pixImage
            };

            paymentsDB.push(newPayment);
            console.log(`[Asaas API] Cobrança criada: ${newPayment.id} (${newPayment.billingType}) - R$ ${newPayment.value}`);
            return newPayment;
        }
    }
};

// --- HELPER FUNCTIONS FOR APP CONSUMPTION ---

/**
 * Ensures a customer exists in Asaas before creating a charge.
 */
export const ensureAsaasCustomer = async (userProfile: any): Promise<string> => {
    // 1. Try to find existing customer
    const existing = await AsaasApi.customers.list({ cpfCnpj: userProfile.cpfCnpj });
    if (existing.length > 0) {
        return existing[0].id;
    }

    // 2. Create if not exists
    const newCustomer = await AsaasApi.customers.create({
        name: userProfile.name,
        email: userProfile.email,
        cpfCnpj: userProfile.cpfCnpj || '000.000.000-00', // Fallback for mock
        mobilePhone: userProfile.mobilePhone || userProfile.phone
    });

    return newCustomer.id;
};

/**
 * Main function to process a payment flow (Customer -> Charge -> Split).
 */
export const processPayment = async (
    amount: number, 
    method: string, 
    userProfile: any
): Promise<AsaasPaymentResponse> => {
    
    // 1. Get Customer ID
    const customerId = await ensureAsaasCustomer(userProfile);

    // 2. Prepare Payment Data
    const billingType = method === 'pix' ? 'PIX' : 'CREDIT_CARD';
    
    const requestData: AsaasPaymentRequest = {
        customer: customerId,
        billingType: billingType,
        value: amount,
        dueDate: new Date().toISOString().split('T')[0],
        description: "Corrida Goly App",
        remoteIp: "127.0.0.1", // Mock IP
        split: [
            {
                walletId: ADMIN_WALLET_ID,
                percentualValue: 20 // 20% Platform Fee
            },
            // Driver wallet would be dynamic in real app, implicitly handling remainder
            {
                walletId: "driver_wallet_mock_123",
                percentualValue: 80
            }
        ]
    };

    if (billingType === 'CREDIT_CARD') {
        // Mock Credit Card Info (In real app, this comes from a secure form)
        requestData.creditCard = {
            holderName: userProfile.name,
            number: "4532123456789012",
            expiryMonth: "12",
            expiryYear: "2030",
            ccv: "123"
        };
        requestData.creditCardHolderInfo = {
            name: userProfile.name,
            email: userProfile.email,
            cpfCnpj: userProfile.cpfCnpj || "00000000000",
            postalCode: "00000000",
            addressNumber: "123",
            phone: userProfile.phone
        };
    }

    // 3. Create Charge
    return await AsaasApi.payments.create(requestData);
};

// Compatibility function for Pix Modal
export const createStaticPixQRCode = async (value: number, userProfile: any): Promise<PixCharge> => {
    const payment = await processPayment(value, 'pix', userProfile);
    
    if (!payment.pixQrCodePayload || !payment.pixQrCodeImage) {
        throw new Error("Falha ao gerar Pix");
    }

    return {
        encodedImage: payment.pixQrCodeImage,
        payload: payment.pixQrCodePayload,
        expirationDate: new Date(Date.now() + 3600 * 1000).toISOString()
    };
};

export const getAdminData = () => {
    // Transform paymentsDB into the format expected by AdminDashboard
    // Filtering only payments that have splits for Admin
    const transactions: PaymentResult[] = paymentsDB
        .filter(p => p.split?.some(s => s.walletId === ADMIN_WALLET_ID))
        .map(p => {
            const adminSplit = p.split?.find(s => s.walletId === ADMIN_WALLET_ID);
            return {
                transactionId: p.id,
                date: new Date(p.dateCreated),
                totalAmount: p.value,
                splits: {
                    admin: {
                        amount: adminSplit?.totalValue || 0,
                        walletId: ADMIN_WALLET_ID
                    }
                }
            };
        })
        .reverse();

    return {
        balance: adminBalance,
        transactions: transactions,
        walletId: ADMIN_WALLET_ID
    };
};
