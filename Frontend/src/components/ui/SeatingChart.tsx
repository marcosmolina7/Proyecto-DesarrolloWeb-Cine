// src/components/ui/SeatingChart.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SeatingChartProps {
    seats: string[];
    selectedSeats: string[];
    occupiedSeats?: string[];
    onSeatClick?: (seatLabel: string) => void;
    isClickable: boolean;
    seatSize?: string;
}

// Extraer la letra de fila (A, B, C, etc.)
const getSeatRow = (seatLabel: string): string => {
    const row = seatLabel.match(/[a-zA-Z]+/)?.[0];
    return row || '';
};

// Extraer el número del asiento
const getSeatNumber = (seatLabel: string): string => {
    const number = seatLabel.match(/\d+/)?.[0];
    return number || '';
};

const SeatingChart: React.FC<SeatingChartProps> = ({ 
    seats, 
    selectedSeats, 
    occupiedSeats = [],
    onSeatClick, 
    isClickable, 
    seatSize = "w-10 h-10"
}) => {
    // Agrupar asientos por fila
    const seatsByRow = useMemo(() => {
        const grouped: Record<string, string[]> = {};
        
        seats.forEach(seat => {
            const row = getSeatRow(seat);
            if (!grouped[row]) {
                grouped[row] = [];
            }
            grouped[row].push(seat);
        });

        // Ordenar asientos dentro de cada fila por número
        Object.keys(grouped).forEach(row => {
            grouped[row].sort((a, b) => {
                const numA = parseInt(getSeatNumber(a));
                const numB = parseInt(getSeatNumber(b));
                return numA - numB;
            });
        });

        return grouped;
    }, [seats]);

    // Obtener filas ordenadas alfabéticamente
    const rows = useMemo(() => {
        return Object.keys(seatsByRow).sort();
    }, [seatsByRow]);

    // Calcular el ancho máximo del grid para la pantalla
    const maxColumns = useMemo(() => {
        return Math.max(...Object.values(seatsByRow).map(row => row.length));
    }, [seatsByRow]);

    const SEAT_WIDTH_PX = 40;
    const SEAT_GAP_PX = 8;
    const gridWidth = useMemo(() => {
        if (maxColumns === 0) return '90%';
        const width = (SEAT_WIDTH_PX * maxColumns) + (SEAT_GAP_PX * (maxColumns - 1)) + 40;
        return `${width}px`;
    }, [maxColumns]);

    return (
        <div className="flex flex-col items-center w-full">
            {/* Leyenda de colores */}
            <div className="flex gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    <span className="text-gray-300">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                    <span className="text-gray-300">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 rounded"></div>
                    <span className="text-gray-300">Ocupado</span>
                </div>
            </div>

            {/* Contenedor principal con fondo oscuro */}
            <div className="p-4 bg-gray-900 rounded-lg w-full flex flex-col items-center">
                
                {/* Pantalla */}
                <div 
                    className="bg-gray-700 text-gray-300 py-2 rounded-lg text-center font-mono w-full mb-6"
                    style={{ maxWidth: gridWidth }}
                >
                    PANTALLA
                </div>
                
                {/* Grid de asientos */}
                <div className="flex justify-center items-center w-full overflow-auto">
                    <div className="flex flex-col items-start gap-3">
                        {rows.map(row => (
                            <div key={row} className="flex gap-2 items-center">
                                {/* Etiqueta de fila */}
                                <div className="w-8 text-center font-bold text-gray-400 flex-shrink-0">
                                    {row}
                                </div>
                                
                                {/* Asientos de la fila */}
                                <div className="flex flex-nowrap gap-2">
                                    {seatsByRow[row].map(seatLabel => {
                                        const isSelected = selectedSeats.includes(seatLabel);
                                        const isOccupied = occupiedSeats.includes(seatLabel);
                                        const seatNumber = getSeatNumber(seatLabel);

                                        return (
                                            <motion.button
                                                key={seatLabel}
                                                type="button"
                                                whileHover={!isOccupied && isClickable ? { scale: 1.1 } : {}}
                                                whileTap={!isOccupied && isClickable ? { scale: 0.9 } : {}}
                                                onClick={() => {
                                                    if (isClickable && !isOccupied && onSeatClick) {
                                                        onSeatClick(seatLabel);
                                                    }
                                                }}
                                                disabled={isOccupied}
                                                className={`${seatSize} rounded-lg flex items-center justify-center font-semibold transition-colors flex-shrink-0`}
                                                style={{
                                                    backgroundColor: isOccupied 
                                                        ? '#DC2626' // red-600
                                                        : isSelected 
                                                        ? '#16A34A' // green-600
                                                        : '#4B5563', // gray-600
                                                    color: isOccupied || isSelected ? 'white' : '#D1D5DB', // text-gray-400
                                                    cursor: isOccupied ? 'not-allowed' : (isClickable ? 'pointer' : 'default'),
                                                    opacity: isOccupied ? 0.7 : 1
                                                }}
                                                title={isOccupied ? 'Asiento ocupado' : seatLabel}
                                            >
                                                {seatNumber}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumen de selección */}
                {selectedSeats.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-700 text-center w-full">
                        <p className="text-gray-300">
                            <span className="font-semibold text-green-400">{selectedSeats.length}</span> asiento(s) seleccionado(s)
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            {selectedSeats.join(', ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatingChart;