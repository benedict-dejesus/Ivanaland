import type { AchievementDef } from './types';

/** Mirrors docs/10_ACHIEVEMENT_BIBLE.md */
export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-find', name: 'First Signal', desc: 'Find your first phone', icon: '📶' },
  { id: 'ten-club', name: 'Double Digits', desc: 'Find 10 phones', icon: '🔟' },
  { id: 'quarter', name: 'Collector', desc: 'Find 25 phones', icon: '🧺' },
  { id: 'halfway', name: 'Halfway Hero', desc: 'Find 50 phones', icon: '⭐' },
  { id: 'deep-cut', name: 'Deep Cuts', desc: 'Find 75 phones', icon: '💎' },
  { id: 'ninety-nine', name: 'So Close', desc: 'Find 99 phones', icon: '😮' },
  { id: 'all-found', name: 'Keeper of Ivanaland', desc: 'Find all 100 phones', icon: '👑' },
  { id: 'crown-jewel', name: 'The Crown Jewel', desc: 'Discover Phone #100', icon: '💫' },
  { id: 'studio-clear', name: "That's a Wrap", desc: 'All 10 Creator Studio City phones', icon: '🎬' },
  { id: 'village-clear', name: 'Family First', desc: 'All 10 Family Village phones', icon: '🏡' },
  { id: 'market-clear', name: 'Fully Fed', desc: 'All 10 Foodie Market phones', icon: '🍧' },
  { id: 'beauty-clear', name: 'Picture Perfect', desc: 'All 10 Beauty Boulevard phones', icon: '💄' },
  { id: 'pets-clear', name: 'Best in Show', desc: 'All 10 Pet Paradise Park phones', icon: '🐶' },
  { id: 'terminal-clear', name: 'Frequent Flyer', desc: 'All 10 Travel Terminal phones', icon: '✈️' },
  { id: 'resort-clear', name: 'Checked Out', desc: 'All 10 Luxury Resort phones', icon: '🏝️' },
  { id: 'festival-clear', name: 'Front Row', desc: 'All 10 Fan Festival Plaza phones', icon: '🎡' },
  { id: 'charity-clear', name: 'Heart of Gold', desc: 'All 10 Charity Corner phones', icon: '💛' },
  { id: 'island-clear', name: 'Castaway No More', desc: 'All 10 Adventure Island phones', icon: '🌋' },
  { id: 'curious', name: 'Professional Poker', desc: 'Poke the world 25 times', icon: '👉' },
  { id: 'very-curious', name: "World's Best Friend", desc: 'Poke the world 100 times', icon: '🫶' },
  { id: 'eagle-eye', name: 'Eagle Eye', desc: 'Find a Tier 4+ phone without its hint', icon: '🦅' },
  { id: 'sequencer', name: 'Storyteller', desc: 'Complete a multi-step discovery', icon: '📖' },
  { id: 'early-bird', name: 'Early Bird', desc: 'Find 5 phones in your first 5 minutes', icon: '🐣' },
  { id: 'tourist', name: 'Grand Tour', desc: 'Visit all 10 districts', icon: '🧭' },
];

export const achById = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
