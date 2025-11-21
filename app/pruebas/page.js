import prisma from "../../lib/db";

// ⭐ SERVER ACTIONS
export const revalidate = 0;

// CREATE
export async function createUser(formData) {
  "use server";
  const name = formData.get("name");
  const email = formData.get("email");
  const age = Number(formData.get("age"));

  await prisma.user.create({
    data: { name, email, age }
  });
}

// UPDATE
export async function updateUser(formData) {
  "use server";
  const id = Number(formData.get("id"));
  const name = formData.get("name");
  const email = formData.get("email");
  const age = Number(formData.get("age"));

  await prisma.user.update({
    where: { id },
    data: { name, email, age }
  });
}

// DELETE
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
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        
        <h1 className="text-2xl font-bold mb-4">Users CRUD</h1>

        {/* Create User */}
        <form
          action={createUser}
          className="flex flex-col gap-3 mb-6 p-4 bg-zinc-50 rounded-lg"
        >
          <input
            name="name"
            placeholder="Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            className="border p-2 rounded"
            required
            min="0"
          />
          <button
            className="bg-black text-white py-2 rounded hover:bg-zinc-800"
          >
            Add User
          </button>
        </form>

        {/* List Users */}
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="border p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-lg">{u.name}</p>
                  <p className="text-sm text-zinc-500">{u.email}</p>
                  <p className="text-sm text-zinc-600 mt-1">Age: {u.age} years</p>
                </div>

                {/* Delete form */}
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button className="text-red-600 hover:text-red-800 font-medium">
                    Delete
                  </button>
                </form>
              </div>

              {/* Update form */}
              <form action={updateUser} className="flex flex-col gap-2 pt-3 border-t">
                <input type="hidden" name="id" value={u.id} />
                <input
                  name="name"
                  defaultValue={u.name}
                  placeholder="Name"
                  className="border p-2 rounded text-sm"
                  required
                />
                <input
                  name="email"
                  type="email"
                  defaultValue={u.email}
                  placeholder="Email"
                  className="border p-2 rounded text-sm"
                  required
                />
                <input
                  name="age"
                  type="number"
                  defaultValue={u.age}
                  placeholder="Age"
                  className="border p-2 rounded text-sm"
                  required
                  min="0"
                />
                <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                  Update
                </button>
              </form>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}