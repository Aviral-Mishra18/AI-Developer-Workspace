export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          bio: string | null
          timezone: string
          system_role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string | null
          bio?: string | null
          timezone?: string
          system_role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          bio?: string | null
          timezone?: string
          system_role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          visibility: 'public' | 'private'
          storage_used: number
          storage_limit: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          visibility?: 'public' | 'private'
          storage_used?: number
          storage_limit?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          visibility?: 'public' | 'private'
          storage_used?: number
          storage_limit?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          workspace_id: string | null
          user_id: string | null
          name: string
          description: string | null
          status: 'active' | 'completed' | 'on-hold' | 'planning'
          progress: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          user_id?: string | null
          name: string
          description?: string | null
          status?: 'active' | 'completed' | 'on-hold' | 'planning'
          progress?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          user_id?: string | null
          name?: string
          description?: string | null
          status?: 'active' | 'completed' | 'on-hold' | 'planning'
          progress?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          project_id: string
          user_id: string
          role: 'lead' | 'member' | 'viewer'
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: 'lead' | 'member' | 'viewer'
          created_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: 'lead' | 'member' | 'viewer'
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
          priority: 'critical' | 'high' | 'medium' | 'low'
          assignee_id: string | null
          due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
          priority?: 'critical' | 'high' | 'medium' | 'low'
          assignee_id?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
          priority?: 'critical' | 'high' | 'medium' | 'low'
          assignee_id?: string | null
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      labels: {
        Row: {
          id: string
          workspace_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      task_labels: {
        Row: {
          task_id: string
          label_id: string
        }
        Insert: {
          task_id: string
          label_id: string
        }
        Update: {
          task_id?: string
          label_id?: string
        }
      }
      ai_chats: {
        Row: {
          id: string
          title: string
          workspace_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          workspace_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          workspace_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_chat_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          created_at?: string
        }
      }
      ai_documentation: {
        Row: {
          id: string
          workspace_id: string
          title: string
          description: string | null
          content: string
          category: string
          version: string
          status: 'published' | 'draft' | 'review'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          description?: string | null
          content: string
          category?: string
          version?: string
          status?: 'published' | 'draft' | 'review'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          content?: string
          category?: string
          version?: string
          status?: 'published' | 'draft' | 'review'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      meeting_notes: {
        Row: {
          id: string
          project_id: string
          title: string
          date: string
          duration: string
          status: 'completed' | 'processing' | 'failed'
          summary: string | null
          transcript: string | null
          speakers: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          date?: string
          duration: string
          status?: 'completed' | 'processing' | 'failed'
          summary?: string | null
          transcript?: string | null
          speakers?: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          date?: string
          duration?: string
          status?: 'completed' | 'processing' | 'failed'
          summary?: string | null
          transcript?: string | null
          speakers?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      meeting_participants: {
        Row: {
          meeting_id: string
          user_id: string
        }
        Insert: {
          meeting_id: string
          user_id: string
        }
        Update: {
          meeting_id?: string
          user_id?: string
        }
      }
      meeting_action_items: {
        Row: {
          id: string
          meeting_id: string
          text: string
          assignee_id: string | null
          done: boolean
          due_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          text: string
          assignee_id?: string | null
          done?: boolean
          due_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          text?: string
          assignee_id?: string | null
          done?: boolean
          due_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_code_reviews: {
        Row: {
          id: string
          project_id: string | null
          file_path: string | null
          commit_id: string | null
          status: 'pending' | 'completed' | 'failed'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          file_path?: string | null
          commit_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          file_path?: string | null
          commit_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_code_review_issues: {
        Row: {
          id: string
          review_id: string
          severity: 'critical' | 'warning' | 'info' | 'suggestion'
          category: 'security' | 'performance' | 'best-practices' | 'code-smells' | 'ai-suggestions'
          title: string
          description: string
          file_path: string
          line_number: number
          suggestion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          severity: 'critical' | 'warning' | 'info' | 'suggestion'
          category: 'security' | 'performance' | 'best-practices' | 'code-smells' | 'ai-suggestions'
          title: string
          description: string
          file_path: string
          line_number: number
          suggestion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          severity?: 'critical' | 'warning' | 'info' | 'suggestion'
          category?: 'security' | 'performance' | 'best-practices' | 'code-smells' | 'ai-suggestions'
          title?: string
          description?: string
          file_path?: string
          line_number?: number
          suggestion?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error' | 'mention'
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'mention'
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error' | 'mention'
          read?: boolean
          link?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          workspace_id: string | null
          project_id: string | null
          user_id: string | null
          action: string
          resource: string
          ip_address: string | null
          status: 'success' | 'failed' | 'warning'
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          project_id?: string | null
          user_id?: string | null
          action: string
          resource: string
          ip_address?: string | null
          status?: 'success' | 'failed' | 'warning'
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          project_id?: string | null
          user_id?: string | null
          action?: string
          resource?: string
          ip_address?: string | null
          status?: 'success' | 'failed' | 'warning'
          details?: Json
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
