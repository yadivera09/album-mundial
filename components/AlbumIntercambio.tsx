'use client';

import { useState, useEffect } from 'react';
import { misRepetidosIniciales, misFaltantes as misFaltantesIniciales, Sticker } from '@/data/stickers';

export default function AlbumIntercambio() {
	const [repetidos, setRepetidos] = useState<Sticker[]>([]);
	const [faltantes, setFaltantes] = useState<Record<string, number[]>>({});
	const [busqueda, setBusqueda] = useState('');
	const [resultadosBusqueda, setResultadosBusqueda] = useState<Sticker[]>([]);
	const [hasBuscado, setHasBuscado] = useState(false);
	const [paisSeleccionado, setPaisSeleccionado] = useState<string>('');

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

	const nombresPaises: Record<string, string[]> = {
		"FWC": ["FIFA", "WORLD CUP", "MUNDIAL"],
		"MEX": ["MEXICO", "MÉXICO"],
		"RSA": ["SOUTH AFRICA", "SUDAFRICA", "SUDÁFRICA"],
		"KOR": ["SOUTH KOREA", "COREA DEL SUR", "KOREA"],
		"CZE": ["CZECH REPUBLIC", "REPUBLICA CHECA", "REPÚBLICA CHECA"],
		"CAN": ["CANADA", "CANADÁ"],
		"BIH": ["BOSNIA", "HERZEGOVINA"],
		"QAT": ["QATAR", "CATAR"],
		"SUI": ["SWITZERLAND", "SUIZA"],
		"BRA": ["BRAZIL", "BRASIL"],
		"MAR": ["MOROCCO", "MARRUECOS"],
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
		"BUL": ["BULGARIA"],
		"POR": ["PORTUGAL"],
		"COD": ["DR CONGO", "CONGO"],
		"UZB": ["UZBEKISTAN", "UZBEKISTÁN"],
		"COL": ["COLOMBIA"],
		"ENG": ["ENGLAND", "INGLATERRA"],
		"CRO": ["CROATIA", "CROACIA"],
		"GHA": ["GHANA"],
		"PAN": ["PANAMA", "PANAMÁ"]
	};

	const buscarSticker = (texto: string) => {
		if (!texto.trim()) {
			setResultadosBusqueda([]);
			setHasBuscado(false);
			return;
		}
		
		const query = texto.trim().toUpperCase();
		setHasBuscado(true);

		const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
		const queryNorm = normalize(query);

		const coincideConPais = (codigo: string, busqueda: string) => {
			if (codigo.includes(busqueda)) return true;
			const nombres = nombresPaises[codigo];
			if (nombres) {
				return nombres.some(n => normalize(n).includes(busqueda));
			}
			return false;
		};
		
		// Si incluye letras y números ("MEX 20" o "ME20" o "Corea 11")
		const matchNumerico = queryNorm.match(/([A-Z\s]+)[^0-9]*([0-9]+)/);
		if (matchNumerico) {
			const textoPais = matchNumerico[1].trim();
			const numero = parseInt(matchNumerico[2]);
			const encontrados = repetidos.filter(s => coincideConPais(s.codigo, textoPais) && s.numero === numero);
			setResultadosBusqueda(encontrados);
			return;
		}
		
		// Si solo escribe letras ("ME", "Corea") o solo un número
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
		if (window.confirm(`¿Seguro que intercambiaste a ${codigo} con el número #${numero}?`)) {
			const nuevos = repetidos.filter(s => !(s.codigo === codigo && s.numero === numero));
			setRepetidos(nuevos);
			localStorage.setItem('repetidos', JSON.stringify(nuevos));
			setResultadosBusqueda(prev => prev.filter(s => !(s.codigo === codigo && s.numero === numero)));
		}
	};

	const marcarFaltanteComoConseguido = (pais: string, numero: number) => {
		if (window.confirm(`¿Deseas guardar a ${pais} #${numero}? Automáticamente ya no aparecerá en tus faltantes.`)) {
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
	const faltantesIniciales = Object.values(misFaltantesIniciales).reduce((acc, nums) => acc + nums.length, 0);
	const totalFaltantes = 628 - (faltantesIniciales - faltantesActuales);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
					📋 Álbum Mundial - Intercambio
				</h1>
				<p className="text-center text-gray-600 mb-8">
					Total repetidos: {repetidos.length} | Total faltantes: {totalFaltantes}
				</p>

				{/* Buscador rápido */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">🔍 Buscar si tengo un número</h2>
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Ej: MEX, ME, MEX 20, USA 11"
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
						<h2 className="text-xl font-semibold mb-4">📌 Mis Repetidos ({repetidos.length})</h2>
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
											<td>{sticker.cantidad}</td>
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
						<h2 className="text-xl font-semibold mb-4">❌ Lo que me falta</h2>
						<div className="mb-4">
							<select
								value={paisSeleccionado}
								onChange={(e) => setPaisSeleccionado(e.target.value)}
								className="w-full p-2 border rounded-lg"
							>
								<option value="">Seleccionar país</option>
								{Object.keys(faltantes).sort().map(pais => (
									<option key={pais} value={pais}>{pais}</option>
								))}
							</select>
						</div>
						{paisSeleccionado && faltantes[paisSeleccionado] && (
							<div>
								<h3 className="font-semibold text-lg mb-2">{paisSeleccionado}</h3>
								<div className="flex flex-wrap gap-2">
									{faltantes[paisSeleccionado].sort((a, b) => a - b).map(num => (
										<button
											key={num}
											onClick={() => marcarFaltanteComoConseguido(paisSeleccionado, num)}
											className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition cursor-pointer"
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
					<p>💡 Los repetidos y faltantes marcados se guardan automáticamente</p>
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