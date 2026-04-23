import { createClient } from "@/lib/supabase/server";

type Todo = {
    id: number;
    name: string;
};

export default async function ResumesPage() {
    const supabase = await createClient();

    const { data: todos } = await supabase
        .from("todos")
        .select("id, name")
        .returns<Todo[]>();

    return (
        <div>
            Resumes Page
            <ul>
                {todos?.map((todo) => (
                    <li key={todo.id}>{todo.name}</li>
                ))}
            </ul>
        </div>
    );
}
