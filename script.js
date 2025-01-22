const data = [
  { name: "Segment 1", value: 20, color: "#FF99CC" }, // Pink segment
  { name: "Segment 2", value: 20, color: "#FFD700" },
  { name: "Segment 3", value: 20, color: "#FF6B6B" },
  { name: "Segment 4", value: 20, color: "#4BC0C0" },
  { name: "Segment 5", value: 20, color: "#36A2EB" },
  { name: "Segment 6", value: 20, color: "#9966FF" },
  { name: "Segment 7", value: 15, color: "#7BC043" },
];

const canvas = document.getElementById("pieChart");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = 150; // Outer radius of the donut
const innerRadius = 72; // Inner radius of the donut (creates the hole)
const paddingAngle = 5 * (Math.PI / 180); // Space between segments (5 degrees in radians)
const cornerRadius = 5; // 5-pixel border radius for each segment
const totalValue = data.reduce((sum, segment) => sum + segment.value, 0);

let activeIndex = null;

function drawDonutChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startAngle = -Math.PI / 2; // Start from the top (12 o'clock position)

  data.forEach((segment, index) => {
    const segmentAngle = (segment.value / totalValue) * (2 * Math.PI);
    const endAngle = startAngle + segmentAngle;

    // Draw the segment with rounded corners
    drawRoundedSegment(startAngle, endAngle, segment.color, index === activeIndex);

    startAngle = endAngle + paddingAngle; // Add space between segments
  });
}

function drawRoundedSegment(startAngle, endAngle, color, isActive) {
  // Calculate the start and end points for the outer and inner arcs
  const outerStart = {
    x: centerX + outerRadius * Math.cos(startAngle),
    y: centerY + outerRadius * Math.sin(startAngle),
  };
  const outerEnd = {
    x: centerX + outerRadius * Math.cos(endAngle),
    y: centerY + outerRadius * Math.sin(endAngle),
  };
  const innerStart = {
    x: centerX + innerRadius * Math.cos(endAngle),
    y: centerY + innerRadius * Math.sin(endAngle),
  };
  const innerEnd = {
    x: centerX + innerRadius * Math.cos(startAngle),
    y: centerY + innerRadius * Math.sin(startAngle),
  };

  // Draw the segment with rounded corners
  ctx.beginPath();

  // Outer arc
  ctx.moveTo(outerStart.x, outerStart.y);
  ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);

  // Rounded corner at the end of the outer arc
  ctx.arcTo(outerEnd.x, outerEnd.y, innerStart.x, innerStart.y, cornerRadius);

  // Inner arc (reverse direction)
  ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);

  // Rounded corner at the start of the inner arc
  ctx.arcTo(innerEnd.x, innerEnd.y, outerStart.x, outerStart.y, cornerRadius);

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Highlight active segment
  if (isActive) {
    // Outer highlight
    ctx.beginPath();
    ctx.moveTo(outerStart.x, outerStart.y);
    ctx.arc(centerX, centerY, outerRadius + 15, startAngle, endAngle);
    ctx.arcTo(outerEnd.x, outerEnd.y, innerStart.x, innerStart.y, cornerRadius);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.arcTo(innerEnd.x, innerEnd.y, outerStart.x, outerStart.y, cornerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Inner highlight
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 8, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius - 2, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function getSegmentAtMouse(x, y) {
  const angle = Math.atan2(y - centerY, x - centerX);
  const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;

  let startAngle = -Math.PI / 2; // Start from the top (12 o'clock position)

  for (let i = 0; i < data.length; i++) {
    const segmentAngle = (data[i].value / totalValue) * (2 * Math.PI);
    const endAngle = startAngle + segmentAngle;

    if (normalizedAngle >= startAngle && normalizedAngle <= endAngle) {
      return i;
    }

    startAngle = endAngle + paddingAngle; // Add space between segments
  }

  return null;
}

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

  if (distance >= innerRadius && distance <= outerRadius) {
    activeIndex = getSegmentAtMouse(mouseX, mouseY);
  } else {
    activeIndex = null;
  }

  drawDonutChart();
});

canvas.addEventListener("mouseleave", () => {
  activeIndex = null;
  drawDonutChart();
});

// Initial draw
drawDonutChart();