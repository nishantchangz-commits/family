export type PantryCategory =
  | 'all'
  | 'dals'
  | 'grains'
  | 'spices'
  | 'oils'
  | 'produce'
  | 'dairy'
  | 'staples';

export interface PantryItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'dals' | 'grains' | 'spices' | 'oils' | 'produce' | 'dairy' | 'staples';
  currentQuantity: number;
  maxQuantity: number;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'bunch' | 'packet' | 'pieces';
  lowStockThreshold: number;
  daysRemaining: number;
  price: number; // in INR
  brand?: string;
  image: string;
  lastRestocked: string;
  isOrganic?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatarText: string;
  avatarColor: string;
  preferenceTag: string;
}

export interface RecipeIngredient {
  pantryItemId?: string;
  name: string;
  quantityPerServing: number;
  unit: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  isTadka?: boolean;
  tadkaSpices?: string[];
  chefTip?: string;
}

export interface MealOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Special Feast';
  calories: number;
  dietaryTags: string[];
  image: string;
  votes: string[]; // member IDs
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface MealSlot {
  id: 'breakfast' | 'lunch' | 'chai' | 'dinner';
  name: string;
  hindiLabel: string;
  scheduledTime: string;
  options: MealOption[];
  activeOptionId: string;
  isCooked?: boolean;
}

export interface CartItem {
  id: string;
  pantryItemId?: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image?: string;
}

export interface MasalaSpice {
  id: string;
  name: string;
  hindiName: string;
  englishMeaning: string;
  fillPercentage: number;
  color: string;
  textColor: string;
  accentRgb: string;
  aroma: string;
  ayurveda: string;
  tadkaRole: string;
}
