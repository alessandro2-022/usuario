import React, { useState } from 'react';
import { StarIcon, CloseIcon } from '../constants';

interface RatingModalProps {
  driverName: string;
  onRatingSubmit: (rating: number | null, feedback: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ driverName, onRatingSubmit }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    onRatingSubmit(rating, feedback);
  };

  const handleSkip = () => {
    onRatingSubmit(null, ''); // Send null rating and empty feedback if skipped
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white p-6 rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold text-goly-dark mb-2">Como foi sua viagem com {driverName}?</h2>
      <p className="text-gray-600 mb-4">Ajude-nos a melhorar avaliando seu motorista.</p>

      {/* Star Rating */}
      <div className="flex space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            onClick={() => handleStarClick(starValue)}
            className="p-1 focus:outline-none"
            aria-label={`Avaliar ${starValue} estrelas`}
          >
            <StarIcon
              className={`h-10 w-10 transition-colors ${
                rating && starValue <= rating ? 'text-goly-yellow' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Feedback Textarea */}
      <textarea
        className="w-full max-w-sm p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-goly-blue mb-6 text-goly-dark"
        rows={3}
        placeholder="Opcional: Compartilhe sua experiência..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        aria-label="Caixa de feedback"
      ></textarea>

      {/* Action Buttons */}
      <div className="flex space-x-4 w-full max-w-sm">
        <button
          onClick={handleSkip}
          className="flex-1 bg-gray-300 text-goly-dark font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
          aria-label="Pular avaliação"
        >
          Pular
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === null} // Disable submit if no rating is selected
          className={`flex-1 bg-goly-blue text-white font-bold py-3 px-6 rounded-lg transition-colors ${
            rating === null ? 'opacity-60 cursor-not-allowed' : 'hover:bg-goly-blue-dark'
          }`}
          aria-label="Enviar avaliação"
        >
          Avaliar
        </button>
      </div>
    </div>
  );
};

export default RatingModal;