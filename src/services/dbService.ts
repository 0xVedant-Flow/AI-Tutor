import { supabase } from '../lib/supabase';

export const dbService = {
  // Example: Fetch study plans for the current user
  async getStudyPlans() {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Save or update a study plan
  async saveStudyPlan(plan: any) {
    const { data, error } = await supabase
      .from('study_plans')
      .upsert([plan])
      .select();
    return { data, error };
  },

  // Save profile/settings
  async saveSettings(settings: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ id: 'current_user_id', ...settings }])
      .select();
    return { data, error };
  },

  // Get profile/settings
  async getSettings() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'current_user_id')
      .single();
    return { data, error };
  },

  // Save chat history
  async saveChatHistory(item: { title: string, subject: string, content: any }) {
    const { data, error } = await supabase
      .from('history')
      .insert([{ ...item, type: 'chat', created_at: new Date() }])
      .select();
    return { data, error };
  },

  // Save MCQ result
  async saveMCQHistory(item: { title: string, subject: string, score: number, total: number }) {
    const { data, error } = await supabase
      .from('history')
      .insert([{ ...item, type: 'mcq', created_at: new Date() }])
      .select();
    return { data, error };
  },

  // Fetch history
  async getHistory() {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Example: Update a task status
  async updateTaskStatus(taskId: string, status: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select();
    return { data, error };
  }
};
