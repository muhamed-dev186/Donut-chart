 const data = [
      { name: "Segment 1", value: 20, color: "#FF99CC" },
      { name: "Segment 2", value: 20, color: "#FFD700" },
      { name: "Segment 3", value: 20, color: "#FF6B6B" },
      { name: "Segment 4", value: 20, color: "#4BC0C0" },
      { name: "Segment 5", value: 20, color: "#36A2EB" },
      { name: "Segment 6", value: 20, color: "#9966FF" },
      { name: "Segment 7", value: 15, color: "#7BC043" }
    ];

    const chartSvg = document.querySelector('.chart-svg');
    const cx = 200;
    const cy = 200;
    const innerRadius = 90;
    const outerRadius = 180;
    const spacing = 2; // Space between segments
    const cornerRadius = 10; // Curve for edges
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    }

    data.forEach((segment, index) => {
      const sliceAngle = (segment.value / total) * 360 - spacing;
      const endAngle = startAngle + sliceAngle;

      const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
      const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
      const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
      const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);

      const largeArc = sliceAngle > 180 ? 1 : 0;

      // Constructing the curved pie segment path
      const pathData = `
        M ${startOuter.x} ${startOuter.y}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}
        Q ${cx} ${cy} ${startInner.x} ${startInner.y}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}
        Q ${cx} ${cy} ${startOuter.x} ${startOuter.y}
        Z
      `;

      const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
      slice.setAttribute("d", pathData);
      slice.setAttribute("fill", segment.color);
      slice.setAttribute("class", "segment");
      slice.dataset.index = index;

      chartSvg.appendChild(slice);

      startAngle += sliceAngle + spacing;
    });

    // Interaction: Move segment outward on hover
    document.querySelectorAll('.segment').forEach((segment, index) => {
      segment.addEventListener('mouseenter', () => {
        const angle = (data[index].value / total) * 360 / 2 + data.slice(0, index).reduce((sum, s) => sum + (s.value / total) * 360, 0);
        const offsetX = Math.cos((Math.PI / 180) * (angle - 90)) * 10;
        const offsetY = Math.sin((Math.PI / 180) * (angle - 90)) * 10;

        segment.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });

      segment.addEventListener('mouseleave', () => {
        segment.style.transform = "translate(0, 0)";
      });
    });
