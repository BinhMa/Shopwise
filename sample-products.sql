-- Xóa dữ liệu cũ (nếu cần)
-- DELETE FROM products;

-- Thêm dữ liệu mẫu cho sản phẩm
INSERT INTO products (name, price, image_url, description, category)
VALUES
  ('Running Pro Max', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', 'Professional running shoes with advanced cushioning technology for serious runners. Features responsive foam and breathable mesh upper.', 'running'),
  
  ('Casual Comfort', 79.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2098&auto=format&fit=crop', 'Everyday casual shoes for maximum comfort. Perfect for walking and light activities with memory foam insoles.', 'casual'),
  
  ('Hiking Explorer', 149.99, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop', 'Durable hiking boots for all terrains. Waterproof exterior with excellent grip for challenging trails.', 'hiking'),
  
  ('Sport Elite', 109.99, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop', 'Versatile sports shoes for various activities. Lightweight design with enhanced stability for gym workouts.', 'sport'),
  
  ('Fashion Trend', 89.99, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop', 'Stylish shoes to keep up with the latest fashion trends. Eye-catching design with premium materials.', 'fashion'),
  
  ('Work Classic', 119.99, 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=2035&auto=format&fit=crop', 'Classic work shoes combining style and comfort. Professional look with all-day comfort for office environments.', 'work'),
  
  ('Trail Runner X', 139.99, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2012&auto=format&fit=crop', 'Advanced trail running shoes with superior grip and protection. Designed for off-road adventures and rough terrain.', 'running'),
  
  ('Urban Walker', 69.99, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1965&auto=format&fit=crop', 'Comfortable walking shoes for urban environments. Stylish enough for casual outings with cushioned support.', 'casual'),
  
  ('Mountain Pro', 179.99, 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?q=80&w=1935&auto=format&fit=crop', 'Professional mountaineering boots for serious hikers. Insulated and waterproof with reinforced toe protection.', 'hiking'),
  
  ('Gym Master', 99.99, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop', 'Specialized training shoes for gym enthusiasts. Extra stability for weightlifting and versatile enough for cardio.', 'sport'),
  
  ('Designer Elite', 159.99, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop', 'Premium designer shoes for fashion-forward individuals. Limited edition with unique styling and premium materials.', 'fashion'),
  
  ('Office Comfort', 129.99, 'https://images.unsplash.com/photo-1613987876445-fcb353cd8e27?q=80&w=1974&auto=format&fit=crop', 'Comfortable dress shoes for long office days. Professional appearance with hidden comfort technology.', 'work'),
  
  ('Marathon Pro', 149.99, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1965&auto=format&fit=crop', 'Long-distance running shoes designed for marathon runners. Exceptional cushioning and energy return for endurance events.', 'running'),
  
  ('Weekend Loafer', 59.99, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2069&auto=format&fit=crop', 'Relaxed loafers for weekend casual wear. Slip-on design with soft interior for maximum relaxation.', 'casual'),
  
  ('Alpine Trekker', 189.99, 'https://images.unsplash.com/photo-1542834759-0c3d8aeb2c19?q=80&w=1974&auto=format&fit=crop', 'High-performance alpine trekking boots. Designed for challenging mountain conditions with superior ankle support.', 'hiking'),
  
  ('Court Champion', 119.99, 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1974&auto=format&fit=crop', 'Tennis and court sports shoes with lateral support. Non-marking soles with excellent traction for quick direction changes.', 'sport'),
  
  ('Runway Special', 199.99, 'https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?q=80&w=1974&auto=format&fit=crop', 'High-end fashion shoes straight from the runway. Statement piece with avant-garde design elements.', 'fashion'),
  
  ('Executive Suite', 169.99, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1972&auto=format&fit=crop', 'Premium executive shoes for business professionals. Hand-crafted with fine leather and traditional styling.', 'work');
