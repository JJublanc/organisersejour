export const onRequestGet: PagesFunction = async () => {
    return new Response(JSON.stringify({ message: "Bonjour depuis le Worker !" }), {
      headers: { "Content-Type": "application/json" },
    });
  };
  