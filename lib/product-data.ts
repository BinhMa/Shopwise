export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  brand: string
}

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Running Pro Max",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    description: "Professional running shoes with advanced cushioning technology.",
    category: "running",
    brand: "Nike",
  },
  {
    id: "2",
    name: "Casual Comfort",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2098&auto=format&fit=crop",
    description: "Everyday casual shoes for maximum comfort.",
    category: "casual",
    brand: "Adidas",
  },
  {
    id: "3",
    name: "Hiking Explorer",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop",
    description: "Durable hiking boots for all terrains.",
    category: "hiking",
    brand: "Columbia",
  },
  {
    id: "4",
    name: "Sport Elite",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop",
    description: "Versatile sports shoes for various activities.",
    category: "sport",
    brand: "Nike",
  },
  {
    id: "5",
    name: "Fashion Trend",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop",
    description: "Stylish shoes to keep up with the latest fashion trends.",
    category: "fashion",
    brand: "Puma",
  },
  {
    id: "6",
    name: "Work Classic",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=2035&auto=format&fit=crop",
    description: "Classic work shoes combining style and comfort.",
    category: "work",
    brand: "Timberland",
  },
]
