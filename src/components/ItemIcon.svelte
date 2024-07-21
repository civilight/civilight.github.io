<script lang="ts">
    type Props = {
        url: string
        name: string
    }

    const { url, name }: Props = $props()
</script>

<img
    src={url}
    alt="icon of {name}"
    loading="lazy"
    class="w-full aspect-square h-auto"
/>
