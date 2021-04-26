import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-embed-menu',
  templateUrl: './embed-menu.component.html',
  styleUrls: ['./embed-menu.component.scss'],
})
export class EmbedMenuComponent {
  @Input() experimentLink: string;
}
