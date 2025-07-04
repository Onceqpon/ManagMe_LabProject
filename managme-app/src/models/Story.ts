export type Priority = 'niski' | 'średni' | 'wysoki';
export type Status = 'todo' | 'doing' | 'done';

export type Story = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  projectId: string;      // Powiązanie z projektem
  createdAt: string;      // Data utworzenia w formacie ISO
  status: Status;
  ownerId: string;        // ID użytkownika (właściciela)
};