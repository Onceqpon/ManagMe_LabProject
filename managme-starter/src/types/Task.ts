export type TaskState = "todo" | "doing" | "done";

export interface Task {
  id: string;
  name: string;                    
  description: string;             
  priority: "niski" | "średni" | "wysoki";
  storyId: string;                 
  estimatedTime: number;           
  state: TaskState;                
  createdAt: string;               
  startDate?: string;              
  endDate?: string;                
  assignedTo: string;             
}
