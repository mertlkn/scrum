import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faLock,
  faLockOpen,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/service/auth.service';
import { Ticket } from '../../../../shared/model/ticket.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-0.5rem)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate(
          '500ms',
          style({ transform: 'translateY(-0.5rem)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('lockAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-0.5rem)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class SideBarComponent implements OnInit {
  @Input() isAdmin = false;
  @Input() open = false;
  @Input() ticketList: any[];
  @Input() currentTicket: any;
  @Output() newTicket = new EventEmitter<Ticket>();
  @Input() sidenavPinned!: boolean;
  @Input() sidenavLocked!: boolean;
  @Output() pinChange = new EventEmitter<boolean>();
  @Output() sidenavLockChange = new EventEmitter();
  @Input() changeLanguage!: () => void;
  @Output() handleLanguage = new EventEmitter();
  @Input() currentLang: any;
  @Input() changeTo: any;

  public activeId: any = '';
  private sidenavEl: any;
  private ticketEl: any;
  private blobEl: any;
  private activeEl: any;
  faThumbtack = faThumbtack;
  faLock = faLock;
  faLockOpen = faLockOpen;

  public userAvatar = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.ticketList = [];
  }

  ngOnInit(): void {
    this.userAvatar = this.authService.getBasicProfile().getImageUrl();
    this.sidenavEl = document.body;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (this.currentTicket.ticketId) {
      this.activeId = this.currentTicket.ticketId;
      this.activeEl = this.sidenavEl.querySelector('.active');

      this.offsetBlob(this.activeEl, this.blobEl);
    }
  }

  ngAfterViewInit(): void {
    if (this.sidenavEl) {
      this.ticketEl = this.sidenavEl.querySelectorAll(
        '.sidenav__container--item'
      );
      this.blobEl = this.sidenavEl.querySelector('.sidenav__blob');
      this.activeEl = this.sidenavEl.querySelector('.active');
    }
    this.handleLanguage.emit();
    this.offsetBlob(this.activeEl, this.blobEl);
    // this.ticketEl.forEach((item: any, index: any) => {
    //   item.addEventListener('click', () => this.click(item));
    // });
  }

  click(item: any, ticket: Ticket) {
    if (this.isAdmin) {
      if (this.activeEl == item) {
        return;
      }

      if (this.activeEl) {
        this.activeEl.classList.remove('active');
      }
      this.setNewTicket(ticket);

      item.classList.add('active');
      this.activeEl = item;
      this.offsetBlob(this.activeEl, this.blobEl);
    } else {
      this.showWarning();
    }
  }

  setNewTicket(ticket: Ticket) {
    this.newTicket.emit(ticket);
  }

  offsetBlob(element: any, blob: any) {
    let offsetActiveItem;
    if (element) {
      offsetActiveItem = element.getBoundingClientRect();
      const top = '-' + (offsetActiveItem.top - 45) + 'px';
      blob.style.transform = `rotate(270deg) translate3d(${top}, 0 , 0)`;
      blob.style.opacity = '1';
    }
  }

  public newPinChange() {
    this.pinChange.emit(!this.sidenavPinned);
  }

  public newSidenavLockChange() {
    this.sidenavLockChange.emit();
  }

  private showWarning(): void {
    this.translate
      .get(['warnings.ticket', 'warnings.okay'])
      .subscribe((trans) => {
        this.snackBar.open(trans['warnings.ticket'], trans['warnings.okay'], {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }
}
