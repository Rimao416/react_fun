import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  prefix?: string; // Pour les drapeaux ou icônes
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border-2 rounded-lg text-left transition-all flex items-center justify-between ${
            isOpen
              ? 'border-[#1F4B3F] ring-2 ring-[#1F4B3F]/20'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {selectedOption.prefix && (
                  <span className="text-lg">{selectedOption.prefix}</span>
                )}
                <span className="text-gray-900 font-medium">
                  {selectedOption.label}
                </span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#1F4B3F] focus:ring-1 focus:ring-[#1F4B3F]/20"
              />
            </div>

            <div className="overflow-y-auto max-h-64">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      option.value === value ? 'bg-[#1F4B3F]/5' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {option.prefix && (
                        <span className="text-lg">{option.prefix}</span>
                      )}
                      <span className={`font-medium ${
                        option.value === value ? 'text-[#1F4B3F]' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </span>
                    </span>
                    {option.value === value && (
                      <Check className="w-5 h-5 text-[#1F4B3F]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
