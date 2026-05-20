import { useEffect, useState } from "react";
import RoleDetail from "./RoleDetail";

export default function RoleDetailWrapper() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("slug"));
  }, []);

  if (!slug) {
    return (
      <div className="ip-empty">
        <p>No role selected. <a href="/interview-prep">Back to roles</a>.</p>
      </div>
    );
  }
  return <RoleDetail slug={slug} />;
}
