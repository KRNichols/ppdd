import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class PowerDragDrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _context!: ComponentFramework.Context<IInputs>; // Non-null assertion for strict mode
    private _notifyOutputChanged!: () => void; // Non-null assertion
    private _container!: HTMLDivElement; // Non-null assertion

    constructor() {
        console.log("[PowerDragDrop] Constructor initialized");
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        console.log("[PowerDragDrop] init started", { context, state, container });
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this.setupDragDrop();
        console.log("[PowerDragDrop] init completed - Drag-drop setup done");
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log("[PowerDragDrop] updateView triggered", { newContext: context });
        this._context = context;
        this.renderItems();
        console.log("[PowerDragDrop] updateView completed - Items rendered");
    }

    public getOutputs(): IOutputs {
        console.log("[PowerDragDrop] getOutputs called");
        return {};
    }

    public destroy(): void {
        console.log("[PowerDragDrop] destroy called - Cleaning up");
    }

    private setupDragDrop(): void {
        console.log("[PowerDragDrop] Setting up drag-drop listeners");
        this._container.classList.add("drag-container");
        this._container.addEventListener("dragstart", this.handleDragStart);
        this._container.addEventListener("dragover", this.handleDragOver);
        this._container.addEventListener("drop", this.handleDrop);
        console.log("[PowerDragDrop] Drag-drop listeners attached");
    }

    private handleDragStart = (event: DragEvent): void => {
        console.log("[PowerDragDrop] Drag started", { target: event.target });
        const target = event.target as HTMLElement;
        if (target.classList.contains("drag-item")) {
            event.dataTransfer?.setData("text/plain", target.id);
        }
    };

    private handleDragOver = (event: DragEvent): void => {
        console.log("[PowerDragDrop] Drag over", { x: event.clientX, y: event.clientY });
        event.preventDefault();
    };

    private handleDrop = (event: DragEvent): void => {
        console.log("[PowerDragDrop] Item dropped", { data: event.dataTransfer?.getData("text/plain") });
        event.preventDefault();
        const itemId = event.dataTransfer?.getData("text/plain");
        const dropZone = event.target as HTMLElement;
        if (itemId && dropZone.classList.contains("drop-zone")) {
            const draggedItem = this._container.querySelector(`#${itemId}`);
            if (draggedItem) {
                dropZone.appendChild(draggedItem);
                console.log("[PowerDragDrop] Item moved to drop zone", { itemId });
            }
        }
    };

    private renderItems(): void {
        console.log("[PowerDragDrop] Rendering items", { items: this._context.parameters.items });
        this._container.innerHTML = "";
        const items = this._context.parameters.items;
        if (!items.loading) {
            items.sortedRecordIds.forEach((recordId: string, index: number) => {
                const record = items.records[recordId];
                const name = record.getValue("name") as string ?? `Item ${index}`;
                const itemDiv = document.createElement("div");
                itemDiv.id = `item-${index}`;
                itemDiv.classList.add("drag-item");
                itemDiv.draggable = true;
                itemDiv.textContent = name;
                this._container.appendChild(itemDiv);
            });
            const dropZone = document.createElement("div");
            dropZone.classList.add("drop-zone");
            dropZone.textContent = "Drop Here";
            this._container.appendChild(dropZone);
            console.log("[PowerDragDrop] Items and drop zone rendered", { totalItems: items.sortedRecordIds.length });
        } else {
            console.log("[PowerDragDrop] Items still loading");
        }
    }
}