<script>
	export let data;
</script>

<h1 class="p-4 text-4xl">Available In</h1>
<ul>
	{#each data.prop as pharm}
		<li class="p-4">{pharm.name} - {pharm.address}</li>
	{/each}
</ul>
