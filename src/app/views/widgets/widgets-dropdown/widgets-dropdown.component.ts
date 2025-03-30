import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular';
import { ApiServiceService } from 'src/app/api-service.service';
import { CommonModule } from '@angular/common';
import { Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Interface for DevOps metrics
interface DevOpsMetric {
  value: string | number;
  trend?: number;
  history?: number[];
}

@Component({
    selector: 'app-widgets-dropdown',
    templateUrl: './widgets-dropdown.component.html',
    styleUrls: ['./widgets-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [RowComponent, ColComponent, WidgetStatAComponent, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective, ChartjsComponent, CommonModule]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public apiService: ApiServiceService
  ) {}

  // Project data
  fetchedProjectData: any;

  // DevOps metrics
  deploymentFrequency: DevOpsMetric | null = null;
  leadTime: DevOpsMetric | null = null;
  mttr: DevOpsMetric | null = null;
  changeFailureRate: DevOpsMetric | null = null;
  deploymentSuccess: DevOpsMetric | null = null;
  codeQuality: DevOpsMetric | null = null;
  testCoverage: DevOpsMetric | null = null;
  securityIssues: DevOpsMetric | null = null;

  // Chart data
  data: any[] = [];
  options: any[] = [];
  deploymentSuccessData: any = {};
  codeQualityData: any = {};
  testCoverageData: any = {};
  securityIssuesData: any = {};

  // Chart labels
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
    'December',
    'January',
    'February',
    'March',
    'April'
  ];

  // Chart datasets
  datasets = [
    [{
      label: 'Deployment Frequency',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40]
    }], [{
      label: 'Lead Time',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-info'),
      pointHoverBorderColor: getStyle('--cui-info'),
      data: [1, 18, 9, 17, 34, 22, 11]
    }], [{
      label: 'MTTR',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [78, 81, 80, 45, 34, 12, 40],
      fill: true
    }], [{
      label: 'Change Failure Rate',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
      barPercentage: 0.7
    }]
  ];

  // Additional datasets for second row
  additionalDatasets = [
    {
      label: 'Deployment Success',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-success'),
      pointHoverBorderColor: getStyle('--cui-success'),
      data: [90, 92, 88, 95, 89, 93, 91]
    },
    {
      label: 'Code Quality',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [75, 78, 80, 79, 82, 83, 85]
    },
    {
      label: 'Test Coverage',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-info'),
      pointHoverBorderColor: getStyle('--cui-info'),
      data: [65, 68, 70, 72, 75, 78, 80],
      fill: true
    },
    {
      label: 'Security Issues',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [12, 10, 8, 6, 5, 4, 3],
      barPercentage: 0.7
    }
  ];

  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngOnInit(): void {
    this.setData();
    this.fetchAllMetrics();

    // Debounce mouse events
    const projectsSub = this.apiService.fetchedprojects()
      .pipe(debounceTime(300)) // Debounce to reduce frequent updates
      .subscribe(data => {
        this.fetchedProjectData = data;
      });

    this.subscriptions.push(projectsSub);
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchAllMetrics(): void {
    // Use forkJoin to make multiple API calls in parallel
    const metricsSub = forkJoin({
      deploymentFrequency: this.apiService.getDeploymentFrequency(),
      deploymentSuccess: this.apiService.getDeploymentSuccess(),
      leadTime: this.apiService.getLeadTime(),
      mttr: this.apiService.getMTTR(),
      changeFailureRate: this.apiService.getChangeFailureRate(),
      codeQuality: this.apiService.getCodeQualityMetrics(),
      testCoverage: this.apiService.getTestCoverageMetrics(),
      securityIssues: this.apiService.getSecurityMetrics()
    }).subscribe({
      next: (results) => {
        // Process the results
        this.deploymentFrequency = results.deploymentFrequency || { value: '4.2/week', trend: 12.5 };
        this.deploymentSuccess = results.deploymentSuccess || { value: 95, trend: 2.3 };
        this.leadTime = results.leadTime || { value: '3.5 days', trend: -15.2 };
        this.mttr = results.mttr || { value: '45 mins', trend: -25.7 };
        this.changeFailureRate = results.changeFailureRate || { value: '4.8%', trend: -8.3 };
        this.codeQuality = results.codeQuality || { value: 'A', trend: 5.1 };
        this.testCoverage = results.testCoverage || { value: 82, trend: 3.7 };
        this.securityIssues = results.securityIssues || { value: 3, trend: -42.5 };

        // Update chart data with real metrics if available
        this.updateChartDataWithMetrics();

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching DevOps metrics:', error);

        // Set default values in case of error
        this.deploymentFrequency = { value: '4.2/week', trend: 12.5 };
        this.deploymentSuccess = { value: 95, trend: 2.3 };
        this.leadTime = { value: '3.5 days', trend: -15.2 };
        this.mttr = { value: '45 mins', trend: -25.7 };
        this.changeFailureRate = { value: '4.8%', trend: -8.3 };
        this.codeQuality = { value: 'A', trend: 5.1 };
        this.testCoverage = { value: 82, trend: 3.7 };
        this.securityIssues = { value: 3, trend: -42.5 };
      }
    });

    this.subscriptions.push(metricsSub);
  }

  updateChartDataWithMetrics(): void {
    // Update chart data if we have history data from the API
    if (this.deploymentFrequency?.history) {
      this.datasets[0][0].data = this.deploymentFrequency.history;
    }

    if (this.leadTime?.history) {
      this.datasets[1][0].data = this.leadTime.history;
    }

    if (this.mttr?.history) {
      this.datasets[2][0].data = this.mttr.history;
    }

    if (this.changeFailureRate?.history) {
      this.datasets[3][0].data = this.changeFailureRate.history;
    }

    // Update additional datasets
    this.setAdditionalChartData();
  }

  setAdditionalChartData(): void {
    // Set data for the second row of charts
    this.deploymentSuccessData = {
      labels: this.labels.slice(0, 7),
      datasets: [this.additionalDatasets[0]]
    };

    this.codeQualityData = {
      labels: this.labels.slice(0, 7),
      datasets: [this.additionalDatasets[1]]
    };

    this.testCoverageData = {
      labels: this.labels.slice(0, 7),
      datasets: [this.additionalDatasets[2]]
    };

    this.securityIssuesData = {
      labels: this.labels.slice(0, 7),
      datasets: [this.additionalDatasets[3]]
    };
  }

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx]
      };
    }
    this.setOptions();
    this.setAdditionalChartData();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}

@Component({
    selector: 'app-chart-sample',
    template: '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>',
    standalone: true,
    imports: [ChartjsComponent]
})
export class ChartSample implements AfterViewInit {

  constructor() {}

  @ViewChild('chart') chartComponent!: ChartjsComponent;

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff'
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [{
      data: [65, 59, 84, 84, 51, 55, 40],
      ...this.colors,
      fill: { value: 65 }
    }]
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = () => {
        return {
          ...this.data,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            ...this.data.datasets[0],
            data: [42, 88, 42, 66, 77],
            fill: { value: 55 }
          }, { ...this.data.datasets[0], borderColor: '#ffbd47', data: [88, 42, 66, 77, 42] }]
        };
      };
      const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const newData = [42, 88, 42, 66, 77];
      let { datasets, labels } = { ...this.data };
      // @ts-ignore
      const before = this.chartComponent?.chart?.data.datasets.length;
      console.log('before', before);
      // console.log('datasets, labels', datasets, labels)
      // @ts-ignore
      // this.data = data()
      this.data = {
        ...this.data,
        datasets: [{ ...this.data.datasets[0], data: newData }, {
          ...this.data.datasets[0],
          borderColor: '#ffbd47',
          data: [88, 42, 66, 77, 42]
        }],
        labels: newLabels
      };
      // console.log('datasets, labels', { datasets, labels } = {...this.data})
      // @ts-ignore
      setTimeout(() => {
        const after = this.chartComponent?.chart?.data.datasets.length;
        console.log('after', after);
      });
    }, 5000);
  }
}
