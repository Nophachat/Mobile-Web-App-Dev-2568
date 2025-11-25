<template>
  <div class="home-page">
    <header class="header">
      <h1>Welcome to Home</h1>
    </header>
    
    <main class="content">
      <section class="hero">
        <p>This is your homepage</p>
        <button @click="handleClick">Get Started</button>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      message: 'Welcome'
    }
  },
  methods: {
    handleClick() {
      console.log('Button clicked')
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.hero {
  text-align: center;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>