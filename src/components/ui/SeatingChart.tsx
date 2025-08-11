// src/components/ui/SeatingChart.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SeatingChartProps {
    seats: string[];
    selectedSeats: string[];
    onSeatClick?: (seatLabel: string) => void;
    isClickable: boolean;
    seatSize?: string;
}

const getRows = (seats: string[]) => {
    const rowLetters = new Set<string>();
    seats.forEach(seat => {
        rowLetters.add(seat.split('-')[0]);
    });
    return Array.from(rowLetters);
};

const SeatingChart: React.FC<SeatingChartProps> = ({ 
    seats, 
    selectedSeats, 
    onSeatClick, 
    isClickable, 
    seatSize = "w-10 h-10" 
}) => {
    const rows = getRows(seats);
    
    const seatsByRow: { [key: string]: string[] } = {};
    rows.forEach(row => {
        seatsByRow[row] = seats.filter(seat => seat.startsWith(row));
    });

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">Selección de Asientos</h3>
            <div className="bg-gray-900 p-4 rounded-lg w-full flex-grow flex flex-col justify-center">
                <div className="flex justify-center mb-6">
                    <div className="w-4/5 h-2 bg-gray-600 rounded-b-full"></div>
                </div>
                <p className="text-center text-sm text-gray-400 mb-6">Pantalla de cine</p>
                
                {/* ❌ Se eliminó la clase max-w-[600px] para que se expanda */}
                <div className="grid grid-cols-[2rem_1fr] gap-x-2 mx-auto w-full"> 
                    {rows.map(row => (
                        <React.Fragment key={row}>
                            <div className="h-10 flex items-center justify-center text-gray-400 font-bold">
                                {row}
                            </div>
                            <div className="grid grid-cols-10 gap-2 mb-2">
                                {seatsByRow[row].map(seatLabel => (
                                    <motion.div
                                        key={seatLabel}
                                        onClick={() => isClickable && onSeatClick?.(seatLabel)}
                                        whileHover={isClickable ? { scale: 1.1 } : {}}
                                        className={`${seatSize} rounded-md flex items-center justify-center text-sm transition-colors
                                            ${selectedSeats?.includes(seatLabel) ? 'bg-blue-600 text-white' : 'bg-gray-500 text-gray-800'}
                                            ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        {seatLabel.split('-')[1]}
                                    </motion.div>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeatingChart;