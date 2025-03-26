import { DOCUMENT, NgStyle, CommonModule} from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, OnDestroy, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { AuthService } from '@auth0/auth0-angular';
import { getStyle, hexToRgba } from '@coreui/utils';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  BadgeComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {ApiServiceService} from '../../api-service.service';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { Subscription } from 'rxjs';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface DevOpsMetric {
  value: string | number;
  trend?: number;
  history?: number[];
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    WidgetsDropdownComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    CommonModule,
    BadgeComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(public auth: AuthService, public apiService: ApiServiceService){
  }
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  // DevOps metrics
  deploymentFrequency: DevOpsMetric | null = null;
  leadTime: DevOpsMetric | null = null;
  mttr: DevOpsMetric | null = null;
  changeFailureRate: DevOpsMetric | null = null;
  deploymentSuccess: DevOpsMetric | null = null;
  codeQuality: DevOpsMetric | null = null;
  testCoverage: DevOpsMetric | null = null;
  securityIssues: DevOpsMetric | null = null;

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/images/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/images/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/images/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.fetchDevOpsMetrics();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initCharts(): void {
    // Update chart labels and data to reflect DevOps pipeline performance
    this.#chartsData.updateLabelsForDevOps();
    this.mainChart = this.#chartsData.mainChart;
  }

  fetchDevOpsMetrics(): void {
    // Fetch deployment frequency
    const deploymentFreqSub = this.apiService.getDeploymentFrequency().subscribe({
      next: (data) => {
        this.deploymentFrequency = data || { value: '4.2/week', trend: 12.5 };
      },
      error: (error) => {
        console.error('Error fetching deployment frequency:', error);
        this.deploymentFrequency = { value: '4.2/week', trend: 12.5 };
      }
    });

    // Fetch lead time
    const leadTimeSub = this.apiService.getLeadTime().subscribe({
      next: (data) => {
        this.leadTime = data || { value: '3.5 days', trend: -15.2 };
      },
      error: (error) => {
        console.error('Error fetching lead time:', error);
        this.leadTime = { value: '3.5 days', trend: -15.2 };
      }
    });

    // Add subscriptions to the array for cleanup
    this.subscriptions.push(deploymentFreqSub, leadTimeSub);
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      // Reinitialize charts with current color mode
      this.#chartsData.initMainChart(this.trafficRadioGroup.value.trafficRadio || 'Month');
      this.initCharts();

      // Apply updated styles to chart
      this.setChartStyles();

      // Force redraw after a short delay to ensure all styles are applied
      setTimeout(() => {
        if (this.mainChartRef()) {
          this.mainChartRef().update();
        }
      }, 150);
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        // Get updated scales with current theme colors
        const scales = this.#chartsData.getScales();

        // Update chart options with new scales
        const options: ChartOptions = { ...this.mainChart.options };
        this.mainChartRef().options.scales = { ...options.scales, ...scales };

        // Update chart colors for dark/light mode
        const isDarkMode = document.documentElement.classList.contains('dark-theme');

        // Update grid colors
        if (this.mainChartRef().options.scales.x) {
          this.mainChartRef().options.scales.x.grid.color = getStyle('--cui-border-color-translucent');
          this.mainChartRef().options.scales.x.ticks.color = getStyle('--cui-body-color');
        }

        if (this.mainChartRef().options.scales.y) {
          this.mainChartRef().options.scales.y.grid.color = getStyle('--cui-border-color-translucent');
          this.mainChartRef().options.scales.y.ticks.color = getStyle('--cui-body-color');
        }

        // Update legend text color
        if (this.mainChartRef().options.plugins && this.mainChartRef().options.plugins.legend) {
          this.mainChartRef().options.plugins.legend.labels = {
            color: getStyle('--cui-body-color')
          };
        }

        // Force chart update with new colors
        this.mainChartRef().update();
      });
    }
  }
}
