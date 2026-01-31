/*
  # Create Completed Projects Table

  1. New Table
    - `completed_projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `completion_date` (date)
      - `project_type` (text)
      - `images` (text array)
      - `videos` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policies for public access (for admin functionality)

  3. Storage
    - Create storage bucket for project media
*/

-- Create completed_projects table
CREATE TABLE IF NOT EXISTS completed_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  completion_date date NOT NULL,
  project_type text NOT NULL CHECK (project_type IN ('residential', 'commercial')),
  images text[] DEFAULT '{}',
  videos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE completed_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (admin functionality)
CREATE POLICY "Allow all to select completed projects"
  ON completed_projects
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert completed projects"
  ON completed_projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update completed projects"
  ON completed_projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete completed projects"
  ON completed_projects
  FOR DELETE
  USING (true);

-- Create storage bucket for project media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project media
CREATE POLICY "Anyone can view project media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-media');

CREATE POLICY "Anyone can upload project media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-media');

CREATE POLICY "Anyone can delete project media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-media');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_completed_projects_updated_at 
    BEFORE UPDATE ON completed_projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();