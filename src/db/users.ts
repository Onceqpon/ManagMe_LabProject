import { supabase } from "../managmeAPI/supabaseClient";
import { User, UserRole } from "../models/userModel";

class UsersDB {
  static async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Błąd pobierania użytkowników:", error);
      return [];
    }

    return data as User[];
  }

  static async getUserById(assignedUserId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", assignedUserId)
      .single();

    if (error) {
      console.error("Błąd pobierania użytkownika po ID:", error);
      return undefined;
    }

    return data as User;
  }

  static async findByNameAndPassword(
    name: string,
    password: string
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("password", password) // tymczasowo plain text
      .single();

    if (error) {
      console.error("Nieprawidłowy login lub hasło:", error);
      return null;
    }

    return data as User;
  }
}

export default UsersDB;
