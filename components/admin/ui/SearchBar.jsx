import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'جستجو...', onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-300
                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                 transition-colors"
      />
      <Search 
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        aria-hidden="true"
      />
    </form>
  );
}

