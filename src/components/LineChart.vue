<!-- https://css-tricks.com/how-to-make-charts-with-svg/ -->
<template>
  <svg version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    class="graph" aria-labelledby="title" role="img">
    <title id="title">A line chart showing some information</title>
  <g class="grid x-grid" id="xGrid">
    <line x1="90" x2="90" y1="5" y2="371"></line>
  </g>
  <g class="grid y-grid" id="yGrid">
    <line x1="90" x2="705" y1="370" y2="370"></line>
  </g>
    <g class="labels x-labels">
    <text x="100" y="400">2008</text>
    <text x="246" y="400">2009</text>
    <text x="392" y="400">2010</text>
    <text x="538" y="400">2011</text>
    <text x="684" y="400">2012</text>
    <text x="400" y="440" class="label-title">Year</text>
  </g>
  <g class="labels y-labels">
    <text x="80" y="15">15</text>
    <text x="80" y="131">10</text>
    <text x="80" y="248">5</text>
    <text x="80" y="373">0</text>
    <text class="label-title" text-anchor="middle" transform="translate(50,200) rotate(-90)">Percent</text>
  </g>
  </svg>
</template>
<script setup>
</script>
<style>
body {
  font-family: 'Open Sans', sans-serif;
}

.graph .labels.x-labels {
  text-anchor: middle;
}

.graph .labels.y-labels {
  text-anchor: end;
}


.graph {
  height: 100%;
  width: 100%;
}

.graph .grid {
  stroke: #ccc;
  stroke-dasharray: 0;
  stroke-width: 1;
}

.labels {
  font-size: 13px;
}

.label-title {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  fill: black;
}

.data {
  fill: red;
  stroke-width: 1; 
}
</style>
