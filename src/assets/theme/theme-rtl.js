// @mui material components
import { createTheme } from "@mui/material/styles";

// RiskCompass AI React base styles
import colors from "/src/assets/theme/base/colors.js";
import breakpoints from "/src/assets/theme/base/breakpoints.js";
import typography from "/src/assets/theme/base/typography.js";
import boxShadows from "/src/assets/theme/base/boxShadows.js";
import borders from "/src/assets/theme/base/borders.js";
import globals from "/src/assets/theme/base/globals.js";

// RiskCompass AI React helper functions
import boxShadow from "/src/assets/theme/functions/boxShadow.js";
import hexToRgb from "/src/assets/theme/functions/hexToRgb.js";
import linearGradient from "/src/assets/theme/functions/linearGradient.js";
import pxToRem from "/src/assets/theme/functions/pxToRem.js";
import rgba from "/src/assets/theme/functions/rgba.js";

// RiskCompass AI React components base styles for @mui material components
import sidenav from "/src/assets/theme/components/sidenav.js";
import list from "/src/assets/theme/components/list/index.js";
import listItem from "/src/assets/theme/components/list/listItem.js";
import listItemText from "/src/assets/theme/components/list/listItemText.js";
import card from "/src/assets/theme/components/card/index.js";
import cardMedia from "/src/assets/theme/components/card/cardMedia.js";
import cardContent from "/src/assets/theme/components/card/cardContent.js";
import button from "/src/assets/theme/components/button/index.js";
import iconButton from "/src/assets/theme/components/iconButton.js";
import inputBase from "/src/assets/theme/components/form/inputBase.js";
import menu from "/src/assets/theme/components/menu/index.js";
import menuItem from "/src/assets/theme/components/menu/menuItem.js";
import switchButton from "/src/assets/theme/components/form/switchButton.js";
import divider from "/src/assets/theme/components/divider.js";
import tableContainer from "/src/assets/theme/components/table/tableContainer.js";
import tableHead from "/src/assets/theme/components/table/tableHead.js";
import tableCell from "/src/assets/theme/components/table/tableCell.js";
import linearProgress from "/src/assets/theme/components/linearProgress.js";
import breadcrumbs from "/src/assets/theme/components/breadcrumbs.js";
import slider from "/src/assets/theme/components/slider.js";
import avatar from "/src/assets/theme/components/avatar.js";
import tooltip from "/src/assets/theme/components/tooltip.js";
import appBar from "/src/assets/theme/components/appBar.js";
import tabs from "/src/assets/theme/components/tabs/index.js";
import tab from "/src/assets/theme/components/tabs/tab.js";
import stepper from "/src/assets/theme/components/stepper/index.js";
import step from "/src/assets/theme/components/stepper/step.js";
import stepConnector from "/src/assets/theme/components/stepper/stepConnector.js";
import stepLabel from "/src/assets/theme/components/stepper/stepLabel.js";
import stepIcon from "/src/assets/theme/components/stepper/stepIcon.js";
import select from "/src/assets/theme/components/form/select.js";
import formControlLabel from "/src/assets/theme/components/form/formControlLabel.js";
import formLabel from "/src/assets/theme/components/form/formLabel.js";
import checkbox from "/src/assets/theme/components/form/checkbox.js";
import radio from "/src/assets/theme/components/form/radio.js";
import autocomplete from "/src/assets/theme/components/form/autocomplete.js";
import input from "/src/assets/theme/components/form/input.js";
import container from "/src/assets/theme/components/container.js";
import popover from "/src/assets/theme/components/popover.js";
import buttonBase from "/src/assets/theme/components/buttonBase.js";
import icon from "/src/assets/theme/components/icon.js";
import svgIcon from "/src/assets/theme/components/svgIcon.js";
import link from "/src/assets/theme/components/link.js";

export default createTheme({
  direction: "rtl",
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInputBase: { ...inputBase },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiInput: { ...input },
    MuiOutlinedInput: { ...input },
    MuiFilledInput: { ...input },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
  },
});