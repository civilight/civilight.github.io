<script lang="ts">
    import { base } from "$app/paths"

    const { data } = $props()
</script>

<a href="{base}/{data.region}/depot">Go to Depot</a>
<a href="{base}/{data.region}/enemies">Go to Enemies</a>
