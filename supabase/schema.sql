-- ========================================
-- SAMBAT.IN Database Schema
-- Run this in your Supabase SQL Editor
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: sambats
-- Main table for storing sambat posts
-- ========================================
CREATE TABLE IF NOT EXISTS sambats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    persona_name VARCHAR(100) NOT NULL,
    is_voice BOOLEAN DEFAULT FALSE,
    voice_url TEXT,
    sentiment VARCHAR(20) DEFAULT 'neutral' CHECK (sentiment IN ('happy', 'sad', 'angry', 'neutral')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_expired BOOLEAN DEFAULT FALSE
);

-- ========================================
-- Table: reactions
-- Stores reactions on sambats
-- ========================================
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sambat_id UUID NOT NULL REFERENCES sambats(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('fire', 'sad', 'laugh', 'hug', 'skull')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Table: reports
-- Stores user reports on sambats
-- ========================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sambat_id UUID NOT NULL REFERENCES sambats(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Table: replies
-- Stores anonymous replies on sambats
-- ========================================
CREATE TABLE IF NOT EXISTS replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sambat_id UUID NOT NULL REFERENCES sambats(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 500),
    persona_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Indexes for performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_sambats_created_at ON sambats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sambats_expires_at ON sambats(expires_at);
CREATE INDEX IF NOT EXISTS idx_sambats_is_expired ON sambats(is_expired);
CREATE INDEX IF NOT EXISTS idx_reactions_sambat_id ON reactions(sambat_id);
CREATE INDEX IF NOT EXISTS idx_reports_sambat_id ON reports(sambat_id);
CREATE INDEX IF NOT EXISTS idx_replies_sambat_id ON replies(sambat_id);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON replies(created_at DESC);

-- ========================================
-- Row Level Security (RLS) Policies
-- Enable RLS for security
-- ========================================

-- Enable RLS
ALTER TABLE sambats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read non-expired sambats
CREATE POLICY "Anyone can read active sambats" ON sambats
    FOR SELECT
    USING (is_expired = FALSE);

-- Allow anyone to create sambats
CREATE POLICY "Anyone can create sambats" ON sambats
    FOR INSERT
    WITH CHECK (TRUE);

-- Allow anyone to read reactions
CREATE POLICY "Anyone can read reactions" ON reactions
    FOR SELECT
    USING (TRUE);

-- Allow anyone to create reactions
CREATE POLICY "Anyone can create reactions" ON reactions
    FOR INSERT
    WITH CHECK (TRUE);

-- Allow anyone to create reports (but not read)
CREATE POLICY "Anyone can create reports" ON reports
    FOR INSERT
    WITH CHECK (TRUE);

-- Allow anyone to read replies
CREATE POLICY "Anyone can read replies" ON replies
    FOR SELECT
    USING (TRUE);

-- Allow anyone to create replies
CREATE POLICY "Anyone can create replies" ON replies
    FOR INSERT
    WITH CHECK (TRUE);

-- ========================================
-- Function: Auto-expire sambats
-- This runs periodically to mark expired sambats
-- ========================================
CREATE OR REPLACE FUNCTION expire_old_sambats()
RETURNS void AS $$
BEGIN
    UPDATE sambats 
    SET is_expired = TRUE 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND is_expired = FALSE;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Optional: Enable Realtime
-- Uncomment if you want real-time updates
-- ========================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE sambats;
-- ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE replies;

