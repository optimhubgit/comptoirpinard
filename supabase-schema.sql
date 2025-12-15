-- =============================================
-- SCHEMA LE CLUB BONBOUCHON - NOËL 2025
-- Avec gestion des lots (plusieurs cartons du même type)
-- =============================================

-- Supprimer les anciennes tables si elles existent
DROP TABLE IF EXISTS carton_vins CASCADE;
DROP TABLE IF EXISTS intentions CASCADE;
DROP TABLE IF EXISTS cartons CASCADE;

-- Table des cartons (caisses de vin)
CREATE TABLE cartons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  region TEXT NOT NULL,
  type TEXT NOT NULL,
  badge TEXT NOT NULL,
  prix INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des vins dans chaque carton
CREATE TABLE carton_vins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carton_id UUID REFERENCES cartons(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  domaine TEXT,
  prix DECIMAL(10,2) NOT NULL,
  quantite INTEGER DEFAULT 2,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des intentions de commande
-- lot_number permet de regrouper par lots de 3
-- lot_complete indique si le lot a atteint les 3 personnes
CREATE TABLE intentions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  caisse TEXT NOT NULL,
  lot_number INTEGER DEFAULT 1,
  lot_complete BOOLEAN DEFAULT false,
  message TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_intentions_caisse ON intentions(caisse);
CREATE INDEX idx_intentions_email ON intentions(email);
CREATE INDEX idx_intentions_status ON intentions(status);
CREATE INDEX idx_intentions_lot ON intentions(caisse, lot_number);
CREATE INDEX idx_cartons_slug ON cartons(slug);
CREATE INDEX idx_cartons_active ON cartons(active);

-- Row Level Security
ALTER TABLE cartons ENABLE ROW LEVEL SECURITY;
ALTER TABLE carton_vins ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all cartons" ON cartons FOR ALL USING (true);
CREATE POLICY "Allow all carton_vins" ON carton_vins FOR ALL USING (true);
CREATE POLICY "Allow all intentions" ON intentions FOR ALL USING (true);

-- =============================================
-- INSERTION DES CARTONS
-- =============================================

INSERT INTO cartons (slug, nom, region, type, badge, prix, active, ordre) VALUES
('bordeaux-decouverte', 'Bordeaux Découverte', 'Bordeaux', 'rouge', 'Rouge • Découverte', 82, true, 1),
('bordeaux-prestige', 'Bordeaux Prestige', 'Bordeaux', 'rouge', 'Rouge • Prestige', 210, true, 2),
('bourgogne-blanc-decouverte', 'Bourgogne Blanc Découverte', 'Bourgogne', 'blanc', 'Blanc • Découverte', 117, true, 3),
('bourgogne-blanc-prestige', 'Bourgogne Blanc Prestige', 'Bourgogne', 'blanc', 'Blanc • Prestige', 205, true, 4),
('bourgogne-rouge-decouverte', 'Bourgogne Rouge Découverte', 'Bourgogne', 'rouge', 'Rouge • Découverte', 126, true, 5),
('bourgogne-rouge-prestige', 'Bourgogne Rouge Prestige', 'Bourgogne', 'rouge', 'Rouge • Prestige', 242, true, 6);

-- =============================================
-- INSERTION DES VINS
-- =============================================

-- Bordeaux Découverte (82€)
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Pic du Versant', 16.90, 2, 1 FROM cartons WHERE slug = 'bordeaux-decouverte';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Terres Rouges', 9.50, 2, 2 FROM cartons WHERE slug = 'bordeaux-decouverte';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'L''Éveil des Rêves', 14.50, 2, 3 FROM cartons WHERE slug = 'bordeaux-decouverte';

-- Bordeaux Prestige (210€)
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'D''Aurage', 45.00, 2, 1 FROM cartons WHERE slug = 'bordeaux-prestige';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Château des Rêves', 25.00, 2, 2 FROM cartons WHERE slug = 'bordeaux-prestige';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Franc Maillet', 35.00, 2, 3 FROM cartons WHERE slug = 'bordeaux-prestige';

-- Bourgogne Blanc Découverte (117€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Bourgogne blanc', 'Domaine Perraud', 12.20, 2, 1 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Mâcon-Villages', 'Domaine Saumaize Michelin', 17.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Côtes de Beaune "La Grande Châtelaine"', 'Domaine Chantal Lescure', 29.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';

-- Bourgogne Blanc Prestige (205€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint-Véran', 'Domaine Perraud', 15.50, 2, 1 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Chablis Per Aspera Vieilles Vignes', 'Domaine Charly Nicolle', 18.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Chassagne-Montrachet', 'Emmanuel Roux', 69.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';

-- Bourgogne Rouge Découverte (126€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Bourgogne rouge "Les Forêts"', 'Domaine Perraud', 15.00, 2, 1 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Givry "Héritage"', 'Domaine Chofflet', 23.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Mercurey "La Charmée"', 'Domaine Brintet', 25.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';

-- Bourgogne Rouge Prestige (242€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Auxey-Duresses', 'Domaine Alex Gambal', 35.00, 2, 1 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Volnay', 'Domaine Chantal Lescure', 40.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Gevrey-Chambertin', 'Domaine Marchand Grillot', 46.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';

-- =============================================
-- VERIFICATION
-- =============================================
SELECT 
  c.nom, 
  c.prix as "Prix",
  COUNT(v.id) as "Nb vins"
FROM cartons c 
LEFT JOIN carton_vins v ON v.carton_id = c.id 
GROUP BY c.id, c.nom, c.prix 
ORDER BY c.ordre;
