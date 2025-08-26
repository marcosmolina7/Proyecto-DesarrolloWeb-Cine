// src/components/ui/SeatGrid.tsx

import { motion } from 'framer-motion';
import React from 'react';

interface SeatGridProps {
  selectedSeats: string[];
  unavailableSeats: string[];
  onSeatToggle: (seatId: string) => void;
  rows: string[];
  seatsPerRow: number;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  selectedSeats,
  unavailableSeats,
  onSeatToggle,
  rows,
  seatsPerRow,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-6 w-full">
        <div className="bg-gray-700 text-gray-300 px-8 py-2 rounded-lg text-center font-mono w-full max-w-lg">
          Pantalla
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        {rows.map((row) => (
          <div key={row} className="flex gap-2 items-center">
            <div className="w-8 text-center font-bold text-gray-400">{row}</div>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                const seatId = `${row}${seatIndex + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isUnavailable = unavailableSeats.includes(seatId);

                return (
                  <motion.button
                    key={seatId}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSeatToggle(seatId)}
                    disabled={isUnavailable}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-colors
                      ${isUnavailable ? 'bg-red-700 cursor-not-allowed' : ''}
                      ${isSelected ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-green-500'}
                    `}
                  >
                    {seatIndex + 1}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SeatGrid;