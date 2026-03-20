import argon2 from "argon2";

async function generateHash(password: string) {
  const hash = await argon2.hash(password);
  console.log(hash);
}

generateHash("password123");
