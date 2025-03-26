import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };
  private isDevOpsMode: boolean = false;

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Method to update chart labels for DevOps metrics
  updateLabelsForDevOps() {
    this.isDevOpsMode = true;
    this.initMainChart();
  }

  initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';
    const brandWarning = getStyle('--cui-warning') ?? '#ffc107';

    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    // Generate data based on whether we're in DevOps mode or not
    if (this.isDevOpsMode) {
      // Generate data for DevOps metrics - more stable, upward trend
      for (let i = 0; i <= this.mainChart['elements']; i++) {
        // Build success rate - high values with slight improvement
        this.mainChart['Data1'].push(this.random(85, 95) + (i * 0.2));

        // Deployment success rate - also high but with more variation
        this.mainChart['Data2'].push(this.random(80, 98));

        // Target threshold - constant high value
        this.mainChart['Data3'].push(90);
      }
    } else {
      // Original random data generation
      for (let i = 0; i <= this.mainChart['elements']; i++) {
        this.mainChart['Data1'].push(this.random(50, 240));
        this.mainChart['Data2'].push(this.random(20, 160));
        this.mainChart['Data3'].push(65);
      }
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
    } else {
      /* tslint:disable:max-line-length */
      const week = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ];
      labels = week.concat(week, week, week);
    }

    // Check if we're in dark mode
    const isDarkMode = document.documentElement.classList.contains('dark-theme');

    // Adjust background opacity for dark mode
    const bgOpacity = isDarkMode ? 15 : 10;
    const brandInfoBgAdjusted = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', bgOpacity);

    // Adjust point hover color for dark mode
    const pointHoverColor = isDarkMode ? getStyle('--cui-gray-100') : '#fff';

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBgAdjusted,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: pointHoverColor
      },
      {
        // brandDanger/Warning
        backgroundColor: 'transparent',
        borderColor: this.isDevOpsMode ? brandWarning : brandDanger,
        pointHoverBackgroundColor: this.isDevOpsMode ? brandWarning : brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    // Set appropriate labels for DevOps metrics
    const datasets: ChartDataset[] = [
      {
        data: this.mainChart['Data1'],
        label: this.isDevOpsMode ? 'Build Success Rate' : 'Current',
        ...colors[0]
      },
      {
        data: this.mainChart['Data2'],
        label: this.isDevOpsMode ? 'Deployment Success Rate' : 'Previous',
        ...colors[1]
      },
      {
        data: this.mainChart['Data3'],
        label: this.isDevOpsMode ? 'Target Threshold' : 'BEP',
        ...colors[2]
      }
    ];

    // Get text color based on current theme
    const textColor = getStyle('--cui-body-color');

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true,
        labels: {
          color: textColor,
          font: {
            family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          }
        }
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        },
        titleColor: textColor,
        bodyColor: textColor,
        backgroundColor: getStyle('--cui-tertiary-bg') || 'rgba(0,0,0,0.8)',
        borderColor: getStyle('--cui-border-color-translucent'),
        borderWidth: 1
      }
    };

    const scales = this.getScales();

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }

  getScales() {
    // Get current theme colors
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');
    const isDarkMode = document.documentElement.classList.contains('dark-theme');

    // Adjust colors based on theme
    const gridColor = isDarkMode
      ? getStyle('--cui-gray-700') || colorBorderTranslucent
      : colorBorderTranslucent;

    const tickColor = colorBody;

    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: gridColor,
          drawOnChartArea: false
        },
        ticks: {
          color: tickColor
        }
      },
      y: {
        border: {
          color: gridColor
        },
        grid: {
          color: gridColor
        },
        max: this.isDevOpsMode ? 100 : 250,
        beginAtZero: true,
        ticks: {
          color: tickColor,
          maxTicksLimit: 5,
          stepSize: Math.ceil((this.isDevOpsMode ? 100 : 250) / 5)
        }
      }
    };
    return scales;
  }
}
