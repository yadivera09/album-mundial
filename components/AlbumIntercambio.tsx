'use client';

import { useState, useEffect } from 'react';
import { misRepetidosIniciales, misFaltantes as misFaltantesIniciales, Sticker } from '@/data/stickers';

const normalize = (str: string) =>
	str.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

const nombreDisplay: Record<string, string> = {
	"FWC": "FIFA World Cup",
	"MEX": "México",
	"RSA": "Sudáfrica",
	"KOR": "Corea del Sur",
	"CZE": "República Checa",
	"CAN": "Canadá",
	"SUI": "Suiza",
	"QAT": "Catar",
	"ITA": "Italia",
	"BRA": "Brasil",
	"MAR": "Marruecos",
	"HAI": "Haití",
	"SCO": "Escocia",
	"USA": "Estados Unidos",
	"PAR": "Paraguay",
	"AUS": "Australia",
	"TUR": "Türkiye",
	"GER": "Alemania",
	"CUW": "Curaçao",
	"CIV": "Costa de Marfil",
	"ECU": "Ecuador",
	"NED": "Países Bajos",
	"JPN": "Japón",
	"SWE": "Suecia",
	"TUN": "Túnez",
	"BEL": "Bélgica",
	"EGY": "Egipto",
	"IRN": "Irán",
	"NZL": "Nueva Zelanda",
	"ESP": "España",
	"CPV": "Cabo Verde",
	"KSA": "Arabia Saudita",
	"URU": "Uruguay",
	"FRA": "Francia",
	"SEN": "Senegal",
	"IRQ": "Irak",
	"NOR": "Noruega",
	"ARG": "Argentina",
	"ALG": "Argelia",
	"AUT": "Austria",
	"JOR": "Jordania",
	"BUL": "Bulgaria",
	"POR": "Portugal",
	"COD": "Congo (RD)",
	"UZB": "Uzbekistán",
	"COL": "Colombia",
	"ENG": "Inglaterra",
	"CRO": "Croacia",
	"GHA": "Ghana",
	"PAN": "Panamá",
	"BIH": "Bosnia",
};

const nombresPaises: Record<string, string[]> = {
	"FWC": ["FIFA", "WORLD CUP", "MUNDIAL"],
	"MEX": ["MEXICO", "MÉXICO"],
	"RSA": ["SOUTH AFRICA", "SUDAFRICA", "SUDÁFRICA"],
	"KOR": ["SOUTH KOREA", "COREA DEL SUR", "KOREA", "COREA"],
	"CZE": ["CZECH REPUBLIC", "CZECHIA", "REPUBLICA CHECA", "REPÚBLICA CHECA"],
	"CAN": ["CANADA", "CANADÁ"],
	"SUI": ["SWITZERLAND", "SUIZA"],
	"QAT": ["QATAR", "CATAR"],
	"ITA": ["ITALY", "ITALIA"],
	"BRA": ["BRAZIL", "BRASIL"],
	"MAR": ["MOROCCO", "MARRUECOS"],
	"HAI": ["HAITI", "HAITÍ"],
	"SCO": ["SCOTLAND", "ESCOCIA"],
	"USA": ["UNITED STATES", "ESTADOS UNIDOS", "EEUU"],
	"PAR": ["PARAGUAY"],
	"AUS": ["AUSTRALIA"],
	"TUR": ["TURKEY", "TURQUÍA", "TURQUIA", "TURKIYE", "TÜRKIYE"],
	"GER": ["GERMANY", "ALEMANIA"],
	"CUW": ["CURACAO", "CURAÇAO", "CURAZAO"],
	"CIV": ["IVORY COAST", "COSTA DE MARFIL"],
	"ECU": ["ECUADOR"],
	"NED": ["NETHERLANDS", "PAISES BAJOS", "PAÍSES BAJOS", "HOLANDA"],
	"JPN": ["JAPAN", "JAPON", "JAPÓN"],
	"SWE": ["SWEDEN", "SUECIA"],
	"TUN": ["TUNISIA", "TUNEZ", "TÚNEZ"],
	"BEL": ["BELGIUM", "BELGICA", "BÉLGICA"],
	"EGY": ["EGYPT", "EGIPTO"],
	"IRN": ["IRAN", "IRÁN"],
	"NZL": ["NEW ZEALAND", "NUEVA ZELANDA"],
	"ESP": ["SPAIN", "ESPAÑA"],
	"CPV": ["CAPE VERDE", "CABO VERDE"],
	"KSA": ["SAUDI ARABIA", "ARABIA SAUDITA", "ARABIA SAUDI"],
	"URU": ["URUGUAY"],
	"FRA": ["FRANCE", "FRANCIA"],
	"SEN": ["SENEGAL"],
	"IRQ": ["IRAQ", "IRAK"],
	"NOR": ["NORWAY", "NORUEGA"],
	"ARG": ["ARGENTINA"],
	"ALG": ["ALGERIA", "ARGELIA"],
	"AUT": ["AUSTRIA"],
	"JOR": ["JORDAN", "JORDANIA"],
	"BUL": ["BULGARIA"],
	"POR": ["PORTUGAL"],
	"COD": ["DR CONGO", "CONGO", "REPÚBLICA DEMOCRÁTICA DEL CONGO"],
	"UZB": ["UZBEKISTAN", "UZBEKISTÁN"],
	"COL": ["COLOMBIA"],
	"ENG": ["ENGLAND", "INGLATERRA"],
	"CRO": ["CROATIA", "CROACIA"],
	"GHA": ["GHANA"],
	"PAN": ["PANAMA", "PANAMÁ"],
	"BIH": ["BOSNIA", "HERZEGOVINA"],
};

export default function AlbumIntercambio() {
	const [repetidos, setRepetidos] = useState<Sticker[]>([]);
	const [faltantes, setFaltantes] = useState<Record<string, number[]>>({});
	const [busqueda, setBusqueda] = useState('');
	const [resultadosBusqueda, setResultadosBusqueda] = useState<Sticker[]>([]);
	const [hasBuscado, setHasBuscado] = useState(false);
	const [paisSeleccionado, setPaisSeleccionado] = useState<string>('');
	const [busquedaPais, setBusquedaPais] = useState('');
	const [nuevoRepetidoCodigo, setNuevoRepetidoCodigo] = useState('');
	const [nuevoRepetidoNumero, setNuevoRepetidoNumero] = useState('');
	const [mostrarAgregarRepetido, setMostrarAgregarRepetido] = useState(false);

	useEffect(() => {
		const guardados = localStorage.getItem('repetidos');
		if (guardados) {
			setRepetidos(JSON.parse(guardados));
		} else {
			setRepetidos(misRepetidosIniciales);
		}

		const guardadosFaltantes = localStorage.getItem('faltantes');
		if (guardadosFaltantes) {
			setFaltantes(JSON.parse(guardadosFaltantes));
		} else {
			setFaltantes(misFaltantesIniciales);
		}
	}, []);

	const restaurarIniciales = () => {
		if (window.confirm('¿Seguro que quieres restaurar todos tus repetidos y faltantes a los valores iniciales? Perderás todos tus cambios.')) {
			setRepetidos(misRepetidosIniciales);
			setFaltantes(misFaltantesIniciales);
			localStorage.setItem('repetidos', JSON.stringify(misRepetidosIniciales));
			localStorage.setItem('faltantes', JSON.stringify(misFaltantesIniciales));
		}
	};

	const coincideConPais = (codigo: string, query: string) => {
		if (normalize(codigo).includes(query)) return true;
		const display = nombreDisplay[codigo] || '';
		if (normalize(display).includes(query)) return true;
		const aliases = nombresPaises[codigo] || [];
		return aliases.some(a => normalize(a).includes(query));
	};

	const buscarSticker = (texto: string) => {
		if (!texto.trim()) {
			setResultadosBusqueda([]);
			setHasBuscado(false);
			return;
		}

		const queryNorm = normalize(texto.trim());
		setHasBuscado(true);

		const matchNumerico = queryNorm.match(/([A-Z\s]+)[^0-9]*([0-9]+)/);
		if (matchNumerico) {
			const textoPais = matchNumerico[1].trim();
			const numero = parseInt(matchNumerico[2]);
			const encontrados = repetidos.filter(s => coincideConPais(s.codigo, textoPais) && s.numero === numero);
			setResultadosBusqueda(encontrados);
			return;
		}

		const encontradosTexto = repetidos.filter(s =>
			coincideConPais(s.codigo, queryNorm) || s.numero.toString() === queryNorm
		);
		setResultadosBusqueda(encontradosTexto);
	};

	const handleBusquedaChange = (valor: string) => {
		setBusqueda(valor);
		buscarSticker(valor);
	};

	const intercambiar = (codigo: string, numero: number) => {
		const sticker = repetidos.find(s => s.codigo === codigo && s.numero === numero);
		if (!sticker) return;

		const msg = sticker.cantidad > 1
			? `¿Intercambiaste un ${codigo} #${numero}? Te quedarán ${sticker.cantidad - 1}.`
			: `¿Intercambiaste tu último ${codigo} #${numero}? Se eliminará de tus repetidos.`;

		if (window.confirm(msg)) {
			let nuevos;
			if (sticker.cantidad > 1) {
				nuevos = repetidos.map(s =>
					s.codigo === codigo && s.numero === numero
						? { ...s, cantidad: s.cantidad - 1 }
						: s
				);
				setResultadosBusqueda(prev =>
					prev.map(s =>
						s.codigo === codigo && s.numero === numero
							? { ...s, cantidad: s.cantidad - 1 }
							: s
					)
				);
			} else {
				nuevos = repetidos.filter(s => !(s.codigo === codigo && s.numero === numero));
				setResultadosBusqueda(prev =>
					prev.filter(s => !(s.codigo === codigo && s.numero === numero))
				);
			}
			setRepetidos(nuevos);
			localStorage.setItem('repetidos', JSON.stringify(nuevos));
		}
	};

	const ajustarCantidad = (codigo: string, numero: number, delta: number) => {
		const idx = repetidos.findIndex(s => s.codigo === codigo && s.numero === numero);
		if (idx === -1) return;
		const sticker = repetidos[idx];
		const newCant = sticker.cantidad + delta;
		let nuevos;
		if (newCant <= 0) {
			nuevos = repetidos.filter((_, i) => i !== idx);
		} else {
			nuevos = repetidos.map((s, i) => i === idx ? { ...s, cantidad: newCant } : s);
		}
		setRepetidos(nuevos);
		localStorage.setItem('repetidos', JSON.stringify(nuevos));
	};

	const agregarRepetido = () => {
		const codigo = nuevoRepetidoCodigo.trim().toUpperCase();
		const numero = parseInt(nuevoRepetidoNumero);
		if (!codigo || isNaN(numero) || numero < 1) return;

		const idx = repetidos.findIndex(s => s.codigo === codigo && s.numero === numero);
		let nuevos;
		if (idx !== -1) {
			nuevos = repetidos.map((s, i) => i === idx ? { ...s, cantidad: s.cantidad + 1 } : s);
		} else {
			nuevos = [...repetidos, { codigo, numero, cantidad: 1 }];
		}
		setRepetidos(nuevos);
		localStorage.setItem('repetidos', JSON.stringify(nuevos));
		setNuevoRepetidoNumero('');
	};

	const marcarFaltanteComoConseguido = (pais: string, numero: number) => {
		if (window.confirm(`¿Ya conseguiste ${pais} #${numero}? Se eliminará de tus faltantes.`)) {
			const nuevosFaltantes = { ...faltantes };
			nuevosFaltantes[pais] = nuevosFaltantes[pais].filter(n => n !== numero);
			if (nuevosFaltantes[pais].length === 0) {
				delete nuevosFaltantes[pais];
			}
			setFaltantes(nuevosFaltantes);
			localStorage.setItem('faltantes', JSON.stringify(nuevosFaltantes));
		}
	};

	const repetidosAgrupados = repetidos.reduce((acc, sticker) => {
		const key = `${sticker.codigo}-${sticker.numero}`;
		if (!acc[key]) {
			acc[key] = { ...sticker };
		}
		return acc;
	}, {} as Record<string, Sticker>);

	const repetidosUnicos = Object.values(repetidosAgrupados);
	const faltantesActuales = Object.values(faltantes).reduce((acc, nums) => acc + nums.length, 0);

	const paisesFiltrados = Object.keys(faltantes).filter(pais => {
		if (!busquedaPais.trim()) return true;
		return coincideConPais(pais, normalize(busquedaPais));
	}).sort();

	const todosLosPaises = Object.keys(nombreDisplay).sort();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
					📋 Álbum Mundial - Intercambio
				</h1>
				<p className="text-center text-gray-600 mb-8">
					Total repetidos: {repetidos.length} | Total faltantes: {faltantesActuales}
				</p>

				{/* Buscador rápido */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">🔍 Buscar si tengo un número</h2>
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Ej: MEX, México, MEX 20, Alemania 5, USA 11"
							value={busqueda}
							onChange={(e) => handleBusquedaChange(e.target.value)}
							className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={() => buscarSticker(busqueda)}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
						>
							Buscar
						</button>
					</div>
					{resultadosBusqueda.length > 0 && (
						<div className="mt-4 p-4 bg-green-100 rounded-lg">
							<p className="font-semibold mb-2">✅ Resultados encontrados:</p>
							{resultadosBusqueda.map((res, idx) => (
								<div key={`${res.codigo}-${res.numero}-${idx}`} className="flex justify-between items-center bg-white p-2 mb-2 rounded shadow-sm">
									<span>{res.codigo} #{res.numero} (x{res.cantidad})</span>
									<button
										onClick={() => intercambiar(res.codigo, res.numero)}
										className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
									>
										Intercambiado
									</button>
								</div>
							))}
						</div>
					)}
					{hasBuscado && resultadosBusqueda.length === 0 && (
						<div className="mt-4 p-4 bg-red-100 rounded-lg">
							<p>❌ No tengo {busqueda.toUpperCase()}</p>
						</div>
					)}
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Lista de repetidos */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">📌 Mis Repetidos ({repetidos.length})</h2>
							<button
								onClick={() => setMostrarAgregarRepetido(!mostrarAgregarRepetido)}
								className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
							>
								{mostrarAgregarRepetido ? 'Cancelar' : '+ Agregar'}
							</button>
						</div>

						{mostrarAgregarRepetido && (
							<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2 items-end flex-wrap">
								<div className="flex-1 min-w-32">
									<label className="text-xs text-gray-600 block mb-1">País</label>
									<select
										value={nuevoRepetidoCodigo}
										onChange={(e) => setNuevoRepetidoCodigo(e.target.value)}
										className="w-full p-2 border rounded text-sm"
									>
										<option value="">Seleccionar...</option>
										{todosLosPaises.map(p => (
											<option key={p} value={p}>{p} — {nombreDisplay[p] || p}</option>
										))}
									</select>
								</div>
								<div className="w-20">
									<label className="text-xs text-gray-600 block mb-1">Número</label>
									<input
										type="number"
										min="1"
										max="20"
										placeholder="#"
										value={nuevoRepetidoNumero}
										onChange={(e) => setNuevoRepetidoNumero(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && agregarRepetido()}
										className="w-full p-2 border rounded text-sm"
									/>
								</div>
								<button
									onClick={agregarRepetido}
									className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition"
								>
									Agregar
								</button>
							</div>
						)}

						<div className="max-h-96 overflow-y-auto">
							<table className="w-full text-sm">
								<thead className="sticky top-0 bg-white">
									<tr className="border-b">
										<th className="text-left py-2">País</th>
										<th className="text-left">#</th>
										<th className="text-left">Cant</th>
										<th className="text-left">Acción</th>
									</tr>
								</thead>
								<tbody>
									{repetidosUnicos.map((sticker, idx) => (
										<tr key={idx} className="border-b">
											<td className="py-2 font-medium">{sticker.codigo}</td>
											<td>{sticker.numero}</td>
											<td>
												<div className="flex items-center gap-1">
													<button
														onClick={() => ajustarCantidad(sticker.codigo, sticker.numero, -1)}
														className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center font-bold"
													>
														−
													</button>
													<span className="w-5 text-center font-medium">{sticker.cantidad}</span>
													<button
														onClick={() => ajustarCantidad(sticker.codigo, sticker.numero, 1)}
														className="w-5 h-5 bg-gray-200 rounded text-xs hover:bg-gray-300 flex items-center justify-center font-bold"
													>
														+
													</button>
												</div>
											</td>
											<td>
												<button
													onClick={() => intercambiar(sticker.codigo, sticker.numero)}
													className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
												>
													Intercambiado
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Lista de faltantes */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4">❌ Lo que me falta ({faltantesActuales})</h2>

						<div className="mb-3">
							<input
								type="text"
								placeholder="Buscar país: MEX, México, Alemania, Egypt..."
								value={busquedaPais}
								onChange={(e) => {
									setBusquedaPais(e.target.value);
									setPaisSeleccionado('');
								}}
								className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="mb-4">
							<select
								value={paisSeleccionado}
								onChange={(e) => setPaisSeleccionado(e.target.value)}
								className="w-full p-2 border rounded-lg"
							>
								<option value="">
									{paisesFiltrados.length === 0
										? 'Sin resultados'
										: `Seleccionar país... (${paisesFiltrados.length})`}
								</option>
								{paisesFiltrados.map(pais => (
									<option key={pais} value={pais}>
										{pais} — {nombreDisplay[pais] || pais} ({faltantes[pais]?.length ?? 0} faltantes)
									</option>
								))}
							</select>
						</div>

						{paisSeleccionado && faltantes[paisSeleccionado] && (
							<div>
								<h3 className="font-semibold text-lg mb-1">
									{paisSeleccionado} — {nombreDisplay[paisSeleccionado] || paisSeleccionado}
								</h3>
								<p className="text-sm text-gray-500 mb-2">
									{faltantes[paisSeleccionado].length} faltantes · Toca un número para marcarlo como conseguido
								</p>
								<div className="flex flex-wrap gap-2">
									{faltantes[paisSeleccionado].sort((a, b) => a - b).map(num => (
										<button
											key={num}
											onClick={() => marcarFaltanteComoConseguido(paisSeleccionado, num)}
											className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-green-100 hover:text-green-800 transition cursor-pointer"
										>
											#{num}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>💡 Los cambios se guardan automáticamente en tu dispositivo</p>
					<button
						onClick={restaurarIniciales}
						className="mt-4 text-red-500 hover:text-red-700 underline"
					>
						Restaurar datos iniciales
					</button>
				</div>
			</div>
		</div>
	);
}
