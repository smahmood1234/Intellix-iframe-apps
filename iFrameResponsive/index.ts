import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class iFrameResponsive implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private iframe: HTMLElement;
    private container: HTMLDivElement;
    private varboolen: boolean;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        context.mode.trackContainerResize(true);
        this.container = container;
        this.varboolen = false;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        if (!this.varboolen) {
            this.varboolen = true;

            // Make the container flexible
            this.container.style.display = "flex";
            this.container.style.flexDirection = "column";
            this.container.style.margin = "0";
            this.container.style.padding = "0";
            this.container.style.border = "none";

            // Create iframe
            this.iframe = document.createElement("iframe");
            this.iframe.style.border = "none";  // No border
            // The iframe will fill the container *once* the container has a defined height
            this.iframe.style.width = "100%";
            this.iframe.style.height = "100%";

            this.container.appendChild(this.iframe);
        }

        // 3) Read allocated height/width from the framework
        const allocatedWidth = context.mode.allocatedWidth;
        const allocatedHeight = context.mode.allocatedHeight;

        // 4) Set the container size (fallback to something if the allocated values are <= 0)
        //    so that our iframe can actually see a definite container size.
        this.container.style.width = allocatedWidth > 0 ? `${allocatedWidth}px` : "100%";
        this.container.style.height = allocatedHeight > 0 ? `${allocatedHeight}px` : "600px";

        const srcurl = context.parameters.sampleProperty.raw;
        srcurl && this.iframe.setAttribute("src", srcurl);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
