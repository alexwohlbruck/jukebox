<template lang="pug">
	div(style='display: flex; flex-direction: row;')
		md-card.album(
			v-for='(album, index) in albums.items',
			:key='album.id',
			md-with-hover,
			@click.native='$router.push({name: "album", params: {id: album.id}})'
		)
			md-card-media
				img(:src='album.images[1].url')

			md-card-content
				.md-body-2 {{album.name}}
				router-link(to='artist').md-body-1 {{album.artists[0].name}}
</template>

<style scoped>
	.album {
		width: 160px;
		margin: 0px 5px;
	}
</style>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'albums-list',
		props: ['albums']
	}
</script>