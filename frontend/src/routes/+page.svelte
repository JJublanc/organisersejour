<script>
	let message = "Clique sur le bouton pour tester /api/hello";

	async function pingHello() {
		const res = await fetch('/api/hello');
		const data = await res.json();
		message = data.message;
	}
</script>

<main>
	<h1>Bienvenue !</h1>
	<p>{message}</p>
	<button on:click={pingHello}>Appeler /api/hello</button>
</main>
