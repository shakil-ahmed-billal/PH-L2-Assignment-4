// components/filters/FilterContent.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/mockData";

const FilterContent = ({
  selectedCategories,
  setSelectedCategories,
  showVegetarian,
  setShowVegetarian,
  showSpicy,
  setShowSpicy,
  priceRange,
  setPriceRange,
}: any) => {

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3>Categories</h3>
        {/* Render categories dynamically */}
        {categories.map((category) => (
          <div key={category.id}>
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
            <Label>{category.name}</Label>
          </div>
        ))}
      </div>

      {/* Vegetarian */}
      <div>
        <Checkbox checked={showVegetarian} onChange={() => setShowVegetarian(!showVegetarian)} />
        <Label>Vegetarian</Label>
      </div>

      {/* Spicy */}
      <div>
        <Checkbox checked={showSpicy} onChange={() => setShowSpicy(!showSpicy)} />
        <Label>Spicy</Label>
      </div>

      {/* Price Range */}
      <div>
        <h3>Price Range</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
        />
      </div>
    </div>
  );
};

export default FilterContent;
