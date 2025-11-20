import prisma from "../lib/db";

// ⭐ SERVER ACTIONS
export const revalidate = 0;

// CREATE
export async function createUser(formData) {
  "use server";
  const name = formData.get("name");
  const email = formData.get("email");

  await prisma.user.create({
    data: { name, email }
  });
}

// DELETE — versión correcta para Server Actions
export async function deleteUser(formData) {
  "use server";
  const id = Number(formData.get("id"));

  await prisma.user.delete({
    where: { id }
  });
}

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" }
  });

  return (
    <div className="min-h-screen bg-zinc-100 p-10">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        
        <h1 className="text-2xl font-bold mb-4">Users CRUD</h1>

        {/* Create User */}
        <form
          action={createUser}
          className="flex flex-col gap-3 mb-6"
        >
          <input
            name="name"
            placeholder="Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          <button
            className="bg-black text-white py-2 rounded hover:bg-zinc-800"
          >
            Add User
          </button>
        </form>

        {/* List Users */}
        <ul className="flex flex-col gap-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-zinc-500">{u.email}</p>
              </div>

              {/* Delete form CORRECTO */}
              <form action={deleteUser}>
                <input type="hidden" name="id" value={u.id} />
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </form>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
