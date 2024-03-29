import { Injectable } from '@angular/core';
import { BaseDialog } from 'src/app/shared/components/base-dialog/models/base-dialog';
import { InvalidControlEnhancerPipe } from '../../pipes/invalid-control-enhancer.pipe';
// tslint:disable: forin

@Injectable({
	providedIn: 'root'
})
export class DialogOptionService {
	constructor(
		private invalidControlEnhancer: InvalidControlEnhancerPipe,
	) { }

	logoutConfirmation: BaseDialog = {
		logo: 'warning',
		title: 'Confirmación',
		text: '¿Esta seguro de que quiere cerrar sesión?',
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Cerrar sesión',
		textCancelButton: 'Cancelar'
	};

	errorServer: BaseDialog = {
		logo: 'error',
		title: 'Ha ocurrido error',
		text: 'Ha ocurrido un error al intentar realizar la petición',
		showButtons: false
	};

	cancelRequest: BaseDialog = {
		logo: 'warning',
		title: 'Cancelar',
		text: `Se procederá a salir al menu, ¿esta seguro?`,
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Salir',
		textCancelButton: 'No'
	};

	exitConfirm: BaseDialog = {
		logo: 'warning',
		title: 'Tiene trabajo sin guardar',
		text: `¿Está seguro de que quiere salir?`,
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Salir',
		textCancelButton: 'Permanecer'
	};

	policyConfirm: BaseDialog = {
		logo: 'check',
		title: 'Cambio de Poliza',
		text: `¿Está seguro de que quiere confirmar este cambio de poliza?`,
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Confirmar',
		textCancelButton: 'Salir'
	};

	policyDeny: BaseDialog = {
		logo: 'warning',
		title: 'Cambio de Poliza',
		text: `¿Está seguro de que quiere rechazar este cambio de poliza?`,
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Confirmar',
		textCancelButton: 'Salir'
	};

	WIP: BaseDialog = {
		logo: 'warning',
		title: 'WIP',
		text: `Esta funcionalidad todavía no esta disponible; puede guardar el formulario.`,
		showButtons: false,
	};

	idNumberNotFound: BaseDialog = {
		logo: 'warning',
		title: 'No se ha encontrado ningún asegurado',
		text: `Intente con otro numero de ID`,
		showButtons: false,
	};

	idNumberNotFound2: BaseDialog = {
		logo: 'warning',
		title: 'No se ha encontrado la poliza',
		text: `Intente con otra poliza`,
		showButtons: false,
	};

	noCNotFound: BaseDialog = {
		logo: 'warning',
		title: 'No se ha encontrado ningúna cotización',
		text: `Intente con otro numero de cotización o solicite una nueva cotización`,
		showButtons: false,
	};

	noAccess: BaseDialog = {
		logo: 'warning',
		title: 'Acceso invalido',
		text: `Usted no tiene los permisos para acceder a esta sección del portal`,
		showButtons: false,
	};

	policySuccess: BaseDialog = {
		logo: 'check',
		title: 'Confirmación',
		text: `El cambio de poliza ha sido confirmado`,
		showButtons: false,
	};

	policyDenySuccess: BaseDialog = {
		logo: 'check',
		title: 'Confirmación',
		text: `El cambio de poliza ha sido rechazada`,
		showButtons: false,
	};

	sendInvitationLink: BaseDialog = {
		logo: 'warning',
		title: 'Introducir correo electrónico',
		showButtons: true,
		showCancelButton: true,
		textPrincipalButton: 'Solicitar',
		textCancelButton: 'Cancelar',
		showInput: true,
		email: '',
	};

  noAvailableChanges: BaseDialog = {
		logo: 'warning',
		title: 'No se han encontrados cambios disponibles',
		text: `Esta poliza no tiene cambios disponibles de este tipo.
		Favor solicitar su cambio próximo a la fecha de aniversario de esta póliza.`,
		showButtons: false,
	};

  sendChangePlans: BaseDialog = {
    logo: 'check',
    title: 'Atención',
    text: `Todos los cambios de planes están sujetos a evaluación y aprobación de la Aseguradora.<br /><br />
          Al momento de realizar el cambio no puede haber siniestros en curso o condición médica crónica
          de alto riesgo (esto lo estaría evaluando elanalista una vez reciba el caso, no se gestiona vía portal).<br /><br />
          Los cambios de planes aprobados de pólizas aceptadas con una condición de aceptación subestándar mantienen,
          en principio, las mismas condiciones de aceptación de la póliza de origen.<br /><br />
          Los cambios de planes para personas a partir de 64 años pudieran requerir
          evaluación médica dependiendo el perfil de riesgo. (Que esta alerta salga solo si
          la persona que solicita tiene esta edad).`,
    showButtons: true,
    showCancelButton: true,
    textPrincipalButton: 'Aceptar',
    textCancelButton: 'Cancelar'
  };

	deleteConfirm(title: string) {
		return {
			logo: 'warning',
			title: `Confirmación`,
			text: `¿Esta seguro de que desea borrar esta solicitud de ${title}?`,
			showButtons: true,
			showCancelButton: true,
			textPrincipalButton: 'Eliminar',
			textCancelButton: 'Cancelar'
		};
	}

	deleteConfirmed(title: string) {
		return {
			logo: 'check',
			title: `Confirmación`,
			text: `Se ha eliminado correctamente la solicitud de ${title}`,
			showButtons: false,
		};
	}

	sendForm(form: string) {
		return {
			logo: 'warning',
			title: 'Confirmación',
			text: `Se procederá a enviar la solicitud de ${form}`,
			showButtons: true,
			showCancelButton: true,
			textPrincipalButton: 'Enviar',
			textCancelButton: 'Cancelar'
		};
	}

	confirmedForm(form: string) {
		return {
			logo: 'check',
			title: 'Confirmación',
			text: `Hemos recibido su solicitud`,
			showButtons: false,
		};
	}

	idNumberFound(data: any) {
		return {
			logo: 'check',
			title: `${data.asegurado.nombres_asegurado} ${data.asegurado.apellidos_asegurado}`,
			text: `Se encontró el siguiente asegurado`,
			showButtons: false,
		};
	}

	idNumberFoundAnonymus(data: any) {
		return {
			logo: 'check',
			title: `${data.asegurado.no_poliza}`,
			text: `La póliza ha sido encontrada.`,
			showButtons: false,
		};
	}

	QuoteFound(data: any) {
		return {
			logo: 'check',
			title: `${data.nombre} Para Tipo Seguro ${data.tipoSeguro}`,
			text: `Se encontró el siguiente asegurado`,
			showButtons: false,
		};
	}

	noCFound(data: any) {
		return {
			logo: 'check',
			title: `Cotización encontrada`,
			text: `Se encontró la cotización asignada a ${data.nombre} ${data.apellidos}`,
			showButtons: false,
		};
	}

	saveForm(form: string) {
		return {
			logo: 'warning',
			title: 'Confirmación',
			text: `Se procederá a guardar la solicitud de ${form}`,
			showButtons: true,
			showCancelButton: true,
			textPrincipalButton: 'Guardar',
			textCancelButton: 'Cancelar'
		};
	}

	confirmedSavedForm(form: string) {
		return {
			logo: 'check',
			title: 'Confirmación',
			text: `La solicitud de ${form} ha sido guardada`,
			showButtons: false,
		};
	}

	confirmedInvitationForm(form: string) {
		return {
			logo: 'check',
			title: 'Confirmación',
			text: `El link de edición ${form} ha sido enviado de manera exitosa al cliente`,
			showButtons: false,
		};
	}

	getInvalidControls(invalidControls: any[]) {
		return {
			logo: 'warning',
			title: 'Campos Inválidos',
			text: 'Revisar las secciones y los campos que aparecen en rojo',
			showButtons: false
		};
	}

	saveSettings() {
		return {
			logo: 'warning',
			title: 'Confirmación',
			text: `Se procederá a guardar los cambios en Configuración`,
			showButtons: true,
			showCancelButton: true,
			textPrincipalButton: 'Guardar',
			textCancelButton: 'Cancelar'
		};
	}

	confirmedSavedSettings() {
		return {
			logo: 'check',
			title: 'Confirmación',
			text: `Los cambios en Configuración han sido guardados`,
			showButtons: false,
		};
	}

	settingsInvalid() {
		return {
			logo: 'warning',
			title: 'Campos Inválidos',
			text: 'Revisar los campos que aparecen en rojo',
			showButtons: false
		};
	}

	saveAdministrationPolicy() {
		return {
			logo: 'warning',
			title: 'Confirmación',
			text: `Se procederá a enviar los documentos a Administración de Pólizas`,
			showButtons: true,
			showCancelButton: true,
			textPrincipalButton: 'Enviar',
			textCancelButton: 'Cancelar'
		};
	}

	confirmedSavedAdministrationPolicy() {
		return {
			logo: 'check',
			title: 'Confirmación',
			text: `Los documentos en Administración de Pólizas han sido guardados y enviados`,
			showButtons: false,
		};
	}

	AdministrationPolicyInvalid() {
		return {
			logo: 'warning',
			title: 'Campos Inválidos',
			text: 'Revisar los campos que aparecen en rojo',
			showButtons: false
		};
	}
}
