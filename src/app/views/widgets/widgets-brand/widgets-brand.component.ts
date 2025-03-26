import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { ColComponent, RowComponent, WidgetStatDComponent } from '@coreui/angular';
import { ChartData } from 'chart.js';

type BrandData = {
  icon: string
  values: any[]
  capBg?: any
  color?: string
  labels?: string[]
  data: ChartData
}

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  styleUrls: ['./widgets-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [RowComponent, ColComponent, WidgetStatDComponent, IconDirective, ChartjsComponent]
})
export class WidgetsBrandComponent implements AfterContentInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() withCharts?: boolean;
  // @ts-ignore
  chartOptions = {
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
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  datasets = {
    borderWidth: 2,
    fill: true
  };
  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };
  brandData: BrandData[] = [
    {
      icon: 'cilSettings',
      values: [{ title: 'CI/CD', value: 'Jenkins' }, { title: 'pipelines', value: '24' }],
      capBg: { '--cui-card-cap-bg': '#2C3E50' },
      color: 'primary',
      labels: [...this.labels],
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [65, 59, 84, 84, 91, 95, 90], label: 'Jenkins', ...this.colors }]
      }
    },
    {
      icon: 'cilCode',
      values: [{ title: 'repositories', value: '47' }, { title: 'PRs', value: '12' }],
      capBg: { '--cui-card-cap-bg': '#4078c0' },
      color: 'primary',
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [28, 48, 40, 19, 34, 27, 38], label: 'GitHub', ...this.colors }]
      }
    },
    {
      icon: 'cilStorage',
      values: [{ title: 'containers', value: '32' }, { title: 'clusters', value: '3' }],
      capBg: { '--cui-card-cap-bg': '#326CE5' },
      color: 'info',
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [78, 81, 80, 85, 84, 82, 88], label: 'Kubernetes', ...this.colors }]
      }
    },
    {
      icon: 'cilCloudDownload',
      values: [{ title: 'artifacts', value: '128' }, { title: 'storage', value: '4.2TB' }],
      capBg: { '--cui-card-cap-bg': 'var(--cui-success)' },
      color: 'success',
      data: {
        labels: [...this.labels],
        datasets: [{ ...this.datasets, data: [35, 43, 56, 22, 97, 23, 64], label: 'Artifacts', ...this.colors }]
      }
    }
  ];

  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
