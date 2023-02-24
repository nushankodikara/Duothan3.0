<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex p-10 m-auto flex-col">
	<!-- Title -->
	<div class="flex flex-row justify-center">
		<h1 class="text-3xl font-bold m-10">Medicine Directory</h1>
	</div>
	<!-- Search bar with medicine name -->
	<div class="flex flex-row justify-center">
		<div class="flex flex-row justify-center">
			<form method="POST">
				<input
					type="text"
					class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
					placeholder="Search Medicine"
					name="medName"
				/>
				<button
					type="submit"
					class="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-400 focus:outline-none w-20 h-10"
					>Search</button
				>
			</form>
		</div>
	</div>
</div>
