<script>
    import "$src/app.css"

    const { children } = $props()
</script>

<div class="min-w-dvw min-h-dvh bg-gray-800 text-gray-200">
    {@render children()}
</div>
