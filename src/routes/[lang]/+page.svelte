<script lang="ts">
    import { base } from "$app/paths"
    const { data } = $props()
</script>

<a href="{base}/{data.lang}/depot">Go to Depot</a>
<a href="{base}/{data.lang}/enemies">Go to Enemies</a>

<p>{data.strings.hello}</p>
