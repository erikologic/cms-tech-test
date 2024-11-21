import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>becederies CMS</h1>
      <Link href="/sign-up">Sign up</Link>
      <Link href="/sign-in">Sign in</Link>
    </main>
  );
}
