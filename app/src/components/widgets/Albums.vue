<template lang="pug">
	md-layout(md-row, md-gutter='true')
		md-card.album(v-for='(album, index) in albums', :key='album.id', md-with-hover, @click.native='$router.push("album")')
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
		computed: {
			...mapState('library', {
				albums: state => state.albums
			})
		}
	}
</script>