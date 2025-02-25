import React from 'react';
import Chart from 'react-apexcharts';
import { useEffect, useState,useMemo } from 'react';
import 'apexcharts/dist/apexcharts.css';
import ApexCharts from 'apexcharts';

// import { fetchMonthlyEarnings } from '../Api/api.js';
export function DashboardSmallChart({ data, colors }) {
  const options = {
    chart: {
      id: 'basic-bar',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 400,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 150,
        },
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div className="bg-white py-2 px-2 text-xs border-[.5px] border-border">' +
          'Total:' +
          ' ' +
          '<span className="font-semibold">' +
          series[seriesIndex][dataPointIndex] +
          '</span>' +
          '</div>'
        );
      },
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '75%',
        distributed: false,
        borderRadius: 2,
      },
    },
    colors: [colors],
  };
  const series = [
    {
      name: 'series-1',
      data: data,
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width="100%"
      height={50}
    />
  );
}

export function DashboardBigChart() {
  const [monthlyEarnings, setMonthlyEarnings] = useState(new Array(12).fill(0));

  useEffect(() => {
    if (monthlyEarnings.some((earning) => earning !== 0)) {
      ApexCharts.exec('area-datetime', 'updateSeries', [
        { name: 'Total Earnings', data: monthlyEarnings },
      ]);
    }
  }, [monthlyEarnings]);

  const series = [{ name: 'Total Earnings', data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] }];


  const options = {
    chart: {
      id: 'area-datetime',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 800 },
      },
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      labels: {
        show: true,
        style: { colors: '#A0A0A0', fontSize: '12px', fontWeight: 400 },
      },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        style: { colors: '#A0A0A0', fontSize: '10px', fontWeight: 400 },
        formatter: (value) => value + 'k',
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) =>
        `<div class="bg-white py-2 px-2 text-xs border-[.5px] border-border">
          Total: <span class="font-semibold">$${series[seriesIndex][dataPointIndex]}</span>
        </div>`,
    },
    grid: {
      show: true,
      borderColor: '#E8EBEE',
      strokeDashArray: 4,
      position: 'back',
    },
    stroke: { curve: 'smooth', width: 1 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    colors: ['#66B5A3'],
  };

  return (
    <Chart
    key={JSON.stringify(monthlyEarnings)} // 🔄 Forces re-render when data updates
    options={options}
    series={[{ name: 'Total Earnings', data: monthlyEarnings }]}
    type="area"
    width="100%"
    height={300}
  />
  );
}
