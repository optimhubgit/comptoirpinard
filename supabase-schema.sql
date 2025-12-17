-- =============================================
-- SCHEMA LE CLUB BONBOUCHON - NOËL 2025
-- Avec gestion des lots et min_personnes configurable
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
  min_personnes INTEGER DEFAULT 3,
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
-- min_personnes = 3 par défaut, 1 pour les champagnes
-- =============================================

INSERT INTO cartons (slug, nom, region, type, badge, prix, min_personnes, active, ordre) VALUES
-- BORDEAUX (3 personnes)
('bordeaux-decouverte', 'Bordeaux Découverte', 'Bordeaux', 'rouge', 'Rouge • Découverte', 82, 3, true, 1),
('bordeaux-prestige', 'Bordeaux Prestige', 'Bordeaux', 'rouge', 'Rouge • Prestige', 210, 3, true, 2),

-- BOURGOGNE BLANC (3 personnes)
('bourgogne-blanc-decouverte', 'Bourgogne Blanc Découverte', 'Bourgogne', 'blanc', 'Blanc • Découverte', 117, 3, true, 3),
('bourgogne-blanc-prestige', 'Bourgogne Blanc Prestige', 'Bourgogne', 'blanc', 'Blanc • Prestige', 205, 3, true, 4),
('bourgogne-blanc', 'Bourgogne Blanc', 'Bourgogne', 'blanc', 'Blanc • Sélection', 197, 3, true, 5),

-- BOURGOGNE ROUGE (3 personnes)
('bourgogne-rouge-decouverte', 'Bourgogne Rouge Découverte', 'Bourgogne', 'rouge', 'Rouge • Découverte', 126, 3, true, 6),
('bourgogne-rouge-prestige', 'Bourgogne Rouge Prestige', 'Bourgogne', 'rouge', 'Rouge • Prestige', 242, 3, true, 7),

-- RHÔNE ROUGE (3 personnes)
('rhone-rouge', 'Rhône Rouge', 'Vallée du Rhône', 'rouge', 'Rouge • Découverte', 82, 3, true, 8),
('rhone-rouge-prestige', 'Rhône Rouge Prestige', 'Vallée du Rhône', 'rouge', 'Rouge • Prestige', 216, 3, true, 9),

-- RHÔNE BLANC (3 personnes)
('rhone-blanc', 'Rhône Blanc', 'Vallée du Rhône', 'blanc', 'Blanc • Sélection', 128, 3, true, 10),

-- CHAMPAGNE CASTELGER (1 personne - pas besoin de groupement)
('champagne-trilogie', 'Champagne Castelger Trilogie', 'Champagne', 'blanc', 'Champagne • Brut', 138, 1, true, 11),
('champagne-blanc-de-blancs', 'Champagne Castelger Blanc de Blancs', 'Champagne', 'blanc', 'Champagne • Zéro Dosage', 156, 1, true, 12),
('champagne-rose', 'Champagne Castelger Rosé', 'Champagne', 'rose', 'Champagne • Rosé', 150, 1, true, 13),
('champagne-ancestrale', 'Champagne Castelger Ancestrale', 'Champagne', 'blanc', 'Champagne • Prestige', 234, 1, true, 14);

-- =============================================
-- INSERTION DES VINS
-- =============================================

-- BORDEAUX DÉCOUVERTE (82€)
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Pic du Versant', 16.90, 2, 1 FROM cartons WHERE slug = 'bordeaux-decouverte';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Terres Rouges', 9.50, 2, 2 FROM cartons WHERE slug = 'bordeaux-decouverte';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'L''Éveil des Rêves', 14.50, 2, 3 FROM cartons WHERE slug = 'bordeaux-decouverte';

-- BORDEAUX PRESTIGE (210€)
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'D''Aurage', 45.00, 2, 1 FROM cartons WHERE slug = 'bordeaux-prestige';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Château des Rêves', 25.00, 2, 2 FROM cartons WHERE slug = 'bordeaux-prestige';
INSERT INTO carton_vins (carton_id, nom, prix, quantite, ordre) 
SELECT id, 'Franc Maillet', 35.00, 2, 3 FROM cartons WHERE slug = 'bordeaux-prestige';

-- BOURGOGNE BLANC DÉCOUVERTE (117€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Bourgogne blanc', 'Domaine Perraud', 12.20, 2, 1 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Mâcon-Villages', 'Domaine Saumaize Michelin', 17.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Côtes de Beaune "La Grande Châtelaine"', 'Domaine Chantal Lescure', 29.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-blanc-decouverte';

-- BOURGOGNE BLANC PRESTIGE (205€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint-Véran', 'Domaine Perraud', 15.50, 2, 1 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Chablis Per Aspera Vieilles Vignes', 'Domaine Charly Nicolle', 18.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Chassagne-Montrachet', 'Emmanuel Roux', 69.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-blanc-prestige';

-- BOURGOGNE BLANC (197€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint Aubin 1er Cru "Les Frionnes"', 'Domaine Emmanuel Roux', 49.50, 2, 1 FROM cartons WHERE slug = 'bourgogne-blanc';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Chablis Per Aspera Vieilles Vignes', 'Domaine Charly Nicolle', 18.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-blanc';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint Romain "Les 5 Climats"', 'Domaine Alain Gras', 31.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-blanc';

-- BOURGOGNE ROUGE DÉCOUVERTE (126€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Bourgogne rouge "Les Forêts"', 'Domaine Perraud', 15.00, 2, 1 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Givry "Héritage"', 'Domaine Chofflet', 23.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Mercurey "La Charmée"', 'Domaine Brintet', 25.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-rouge-decouverte';

-- BOURGOGNE ROUGE PRESTIGE (242€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Auxey-Duresses', 'Domaine Alex Gambal', 35.00, 2, 1 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Volnay', 'Domaine Chantal Lescure', 40.00, 2, 2 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Gevrey-Chambertin', 'Domaine Marchand Grillot', 46.00, 2, 3 FROM cartons WHERE slug = 'bourgogne-rouge-prestige';

-- RHÔNE ROUGE (82€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Côtes du Rhône', 'Domaine Cristia', 10.00, 2, 1 FROM cartons WHERE slug = 'rhone-rouge';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Crozes Hermitage "Esquisses"', 'Domaine des Hauts Châssis', 15.80, 2, 2 FROM cartons WHERE slug = 'rhone-rouge';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Vacqueyras "Les Pénitents"', 'Domaine Lestours-Clocher', 15.00, 2, 3 FROM cartons WHERE slug = 'rhone-rouge';

-- RHÔNE ROUGE PRESTIGE (216€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint Joseph "Préface"', 'Domaine Pierre Jean Villa', 34.00, 2, 1 FROM cartons WHERE slug = 'rhone-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Châteauneuf-du-Pape "Cuvée Domaine"', 'Domaine Cristia', 30.00, 2, 2 FROM cartons WHERE slug = 'rhone-rouge-prestige';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Côte Rôtie "Les Champon''s"', 'Domaine Stéphane Pichat', 44.00, 2, 3 FROM cartons WHERE slug = 'rhone-rouge-prestige';

-- RHÔNE BLANC (128€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Côtes du Rhône', 'Domaine Cristia', 10.00, 2, 1 FROM cartons WHERE slug = 'rhone-blanc';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Saint Péray "Les Calcaires"', 'Domaine des Hauts Châssis', 19.00, 2, 2 FROM cartons WHERE slug = 'rhone-blanc';
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Condrieu "Lieu-Dit Chanson"', 'Domaine Louis Chomel', 35.00, 2, 3 FROM cartons WHERE slug = 'rhone-blanc';

-- CHAMPAGNE CASTELGER TRILOGIE (138€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Trilogie Brut', 'Champagne Castelger', 23.00, 6, 1 FROM cartons WHERE slug = 'champagne-trilogie';

-- CHAMPAGNE CASTELGER BLANC DE BLANCS (156€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Blanc de Blancs Zéro Dosage', 'Champagne Castelger', 26.00, 6, 1 FROM cartons WHERE slug = 'champagne-blanc-de-blancs';

-- CHAMPAGNE CASTELGER ROSÉ (150€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Rosé', 'Champagne Castelger', 25.00, 6, 1 FROM cartons WHERE slug = 'champagne-rose';

-- CHAMPAGNE CASTELGER ANCESTRALE (234€)
INSERT INTO carton_vins (carton_id, nom, domaine, prix, quantite, ordre) 
SELECT id, 'Ancestrale', 'Champagne Castelger', 39.00, 6, 1 FROM cartons WHERE slug = 'champagne-ancestrale';
